import requests
from flask import current_app
from app.models.stock_data import StockData
from app import db
from datetime import datetime
from groq import Groq
import os
import requests
from app.models.news_sentiment_model import NewsSentiment, NewsAuthor, TickerSentiment, NewsTopic
from sqlalchemy import cast, Date, extract

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# Set the system prompt for the LLM
system_prompt = {
    "role": "system",
    "content": "You are a helpful assistant. Provide short summaries of stock performance."
}

def fetch_stock_data(symbol):
    api_key = current_app.config['ALPHA_VANTAGE_API_KEY']
    url = f"https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={symbol}&interval=1min&apikey={api_key}"
    
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        if 'Time Series (1min)' in data:
            time_series = data['Time Series (1min)']
            for timestamp, values in time_series.items():
                # Save each timestamp's data in the database
                stock_data = StockData(
                    symbol=symbol,
                    timestamp=datetime.strptime(timestamp, '%Y-%m-%d %H:%M:%S'),
                    open_price=float(values['1. open']),
                    high_price=float(values['2. high']),
                    low_price=float(values['3. low']),
                    close_price=float(values['4. close']),
                    volume=int(values['5. volume'])
                )
                db.session.add(stock_data)
            db.session.commit()
        return data
    else:
        return None


#stock summary generation function
def generate_stock_summary(symbol):
    """
    Fetch stock data for the given symbol from the PostgreSQL database, 
    then pass the data to Groq LLM to generate a summary.
    """

    # Fetch stock data for the given symbol from the database
    stock_data = StockData.query.filter_by(symbol=symbol).all()

    if not stock_data:
        return f"No stock data available for symbol: {symbol}"

    # Prepare stock data for summarization
    stock_info = [
        {
            "timestamp": data.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
            "open_price": data.open_price,
            "high_price": data.high_price,
            "low_price": data.low_price,
            "close_price": data.close_price,
            "volume": data.volume
        }
        for data in stock_data
    ]

    # Construct a user prompt summarizing the stock data
    prompt = f"Analyze the stock performance for {symbol} with the following data:\n"

    for entry in stock_info:
        prompt += f"Date: {entry['timestamp']}, Open: {entry['open_price']}, High: {entry['high_price']}, Low: {entry['low_price']}, Close: {entry['close_price']}, Volume: {entry['volume']}\n"

    # Initialize chat history with the system prompt
    chat_history = [system_prompt]

    # Add the prompt with stock data to the chat history
    chat_history.append({"role": "user", "content": prompt})

    # Use the Groq client to generate a summary
    response = client.chat.completions.create(
        model="llama3-70b-8192",
        messages=chat_history,
        max_tokens=150,
        temperature=1.0
    )

    # Extract the assistant's response (summary) from the response
    summary = response.choices[0].message.content

    return summary




def get_news_sentiment(tickers):
    """
    Fetch news sentiment for AAPL stock using Alpha Vantage API.
    """
    api_key = current_app.config['ALPHA_VANTAGE_API_KEY']
    base_url = f"https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers={tickers}&apikey={api_key}"

    response = requests.get(base_url)

    if response.status_code == 200:
        # Return the response JSON from Alpha Vantage API
        return response.json()
    else:
        # Handle errors and return a message if the request fails
        return {"error": f"Failed to fetch news sentiment for AAPL. Status code: {response.status_code}"}




def save_news_sentiment_to_db(news_data):
    """
    Saves the news sentiment data to the PostgreSQL database.
    """

    for article in news_data['feed']:
        # Create a new NewsSentiment object
        news_sentiment = NewsSentiment(
            title=article['title'],
            url=article['url'],
            summary=article['summary'],
            time_published=article['time_published'],
            source=article['source'],
            source_domain=article['source_domain'],
            overall_sentiment_label=article['overall_sentiment_label'],
            overall_sentiment_score=article['overall_sentiment_score'],
            banner_image=article.get('banner_image', None)
        )

        db.session.add(news_sentiment)
        db.session.flush()  # Flush to get the news_sentiment_id

        # Save authors
        for author in article['authors']:
            news_author = NewsAuthor(
                author_name=author,
                news_sentiment_id=news_sentiment.id
            )
            db.session.add(news_author)

        # Save ticker sentiments
        for ticker in article['ticker_sentiment']:
            ticker_sentiment = TickerSentiment(
                ticker=ticker['ticker'],
                relevance_score=float(ticker['relevance_score']),
                ticker_sentiment_label=ticker['ticker_sentiment_label'],
                ticker_sentiment_score=float(ticker['ticker_sentiment_score']),
                news_sentiment_id=news_sentiment.id
            )
            db.session.add(ticker_sentiment)

        # Save topics
        for topic in article['topics']:
            news_topic = NewsTopic(
                topic=topic['topic'],
                relevance_score=float(topic['relevance_score']),
                news_sentiment_id=news_sentiment.id
            )
            db.session.add(news_topic)

    # Commit all the changes to the database
    db.session.commit()


def get_news_by_topic(topic_name):
    if not topic_name:
        return None, "Topic is required"
    
    # Query all NewsTopic entries with the matching topic name
    topics = NewsTopic.query.filter_by(topic=topic_name).all()
    
    if not topics:
        return None, "Topic not found"
    
    # Prepare the result list
    results = []

    # Loop through all topics and retrieve the associated NewsSentiment
    for topic in topics:
        news_sentiment = NewsSentiment.query.filter_by(id=topic.news_sentiment_id).first()
        
        if news_sentiment:
            results.append({
                "title": news_sentiment.title,
                "summary": news_sentiment.summary,
                "banner_image": news_sentiment.banner_image,
                "source": news_sentiment.source,
                "url": news_sentiment.url,
                "overall_sentiment_label": news_sentiment.overall_sentiment_label,
                "relevance_score": news_sentiment.overall_sentiment_score
            })

    # If no news sentiments were found, return an error
    if not results:
        return None, "No news sentiments found for the topic"

    return results, None


def get_all_topics():
    try:
        # Query to fetch all distinct topics
        topics = NewsTopic.query.with_entities(NewsTopic.topic).distinct().all()

        if not topics:
            return None, "No topics found"

        # Convert the list of tuples into a simple list of topic strings
        topic_list = [topic[0] for topic in topics]

        return topic_list, None
    except Exception as e:
        return None, str(e)
    

def get_stock_performance(date_str, hour_str=None, minute_str=None):
    try:
        # Convert date string to a datetime object
        date = datetime.strptime(date_str, '%Y-%m-%d')

        # Base query filtering by casting timestamp to Date
        query = StockData.query.filter(cast(StockData.timestamp, Date) == date.date())

        # If hour is provided, filter by hour as well
        if hour_str:
            hour = int(hour_str)
            query = query.filter(extract('hour', StockData.timestamp) == hour)

        # If minute is provided, filter by minute as well
        if minute_str:
            minute = int(minute_str)
            query = query.filter(extract('minute', StockData.timestamp) == minute)

        # Fetch the query results and order by symbol and timestamp
        stock_data = query.order_by(StockData.symbol, StockData.timestamp).all()

        # Prepare the results
        result = {}
        for stock in stock_data:
            if stock.symbol not in result:
                result[stock.symbol] = []
            result[stock.symbol].append({
                'timestamp': stock.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
                'close_price': stock.close_price
            })

        return result, None  # Return the result and no error
    except Exception as e:
        return None, str(e)  # Return None and the error message
    

def get_stock_performance_hour(date_str, hour_str=None):
    try:
        # Convert date string to a datetime object
        date = datetime.strptime(date_str, '%Y-%m-%d')

        # Base query filtering by casting timestamp to Date
        query = StockData.query.filter(cast(StockData.timestamp, Date) == date.date())

        # If hour is provided, filter by hour as well
        if hour_str:
            hour = int(hour_str)
            query = query.filter(extract('hour', StockData.timestamp) == hour)

        # Fetch the query results and order by symbol and timestamp
        stock_data = query.order_by(StockData.symbol, StockData.timestamp).all()

        # Prepare the results
        result = {}
        for stock in stock_data:
            if stock.symbol not in result:
                result[stock.symbol] = []
            result[stock.symbol].append({
                'timestamp': stock.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
                'close_price': stock.close_price
            })

        return result, None  # Return the result and no error
    except Exception as e:
        return None, str(e)  # Return None and the error message
    

#chatbot
def generate_stock_qa_response(question, symbol):
    """
    Fetch stock data for the given symbol from the PostgreSQL database,
    then pass the data and question to the Groq LLM to generate a summary 
    and related news. If the symbol is not found, it should respond with 
    "I don't know".
    """

    # Fetch stock data for the given symbol from the database
    stock_data = StockData.query.filter_by(symbol=symbol).all()

    if not stock_data:
        return "I don't know."


    # Construct a user prompt summarizing the stock data and asking for related news
    prompt = f"Answer the stock question: {question}. Analyze the stock performance for {symbol} with the following data and generate summary and news related to the market:\n"

    # Initialize chat history with a system prompt (this could be static or dynamic)
    chat_history = [{"role": "system", "content": "You are a stock analyst. You provide stock related latest informations"}]
    chat_history.append({"role": "user", "content": prompt})

    # Use the Groq LLM (or a stand-in like OpenAI) to generate a response
    response = client.chat.completions.create(
        model="llama3-70b-8192",
        messages=chat_history,
        max_tokens=150,
        temperature=1.0
    )

    # Extract the assistant's response (summary and news) from the response
    summary = response.choices[0].message.content

    return summary