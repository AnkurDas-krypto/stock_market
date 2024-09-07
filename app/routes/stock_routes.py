from flask import Blueprint, jsonify, request
from app.services.stock_service import (fetch_stock_data, 
                        generate_stock_summary, get_news_sentiment, save_news_sentiment_to_db, get_news_by_topic,
                        get_all_topics, get_stock_performance, get_stock_performance_hour, generate_stock_qa_response)

stock_blueprint = Blueprint('stock', __name__)

@stock_blueprint.route('/api/stock-data', methods=['GET'])
def get_stock_data():
    symbol = request.args.get('symbol')
    if not symbol:
        return jsonify({'error': 'Stock symbol is required'}), 400
    
    data = fetch_stock_data(symbol)
    if data:
        return jsonify(data), 200
    else:
        return jsonify({'error': 'Failed to fetch data'}), 500

# Route to generate summary of stock movement based on stored data
@stock_blueprint.route('/api/stock-summary/<symbol>', methods=['GET'])
def get_stock_summary(symbol):
    summary = generate_stock_summary(symbol)
    if summary:
        return jsonify({"symbol": symbol, "summary": summary}), 200
    else:
        return jsonify({'error': f'Failed to generate summary for {symbol}'}), 500
    
@stock_blueprint.route('/api/news-sentiment', methods=['GET'])
def news_sentiment():
    # Get tickers from the query parameter
    tickers = request.args.get('tickers')

    if not tickers:
        return jsonify({"error": "Stock tickers are required"}), 400

    # Call the service function to get the news sentiment
    data = get_news_sentiment(tickers)

    return jsonify(data), 200


# Route to fetch news sentiment and save it in the database
@stock_blueprint.route('/api/news-sentiment/save', methods=['GET'])
def news_sentiment_save():
    tickers = request.args.get('tickers')

    if not tickers:
        return jsonify({"error": "Stock tickers are required"}), 400

    # Fetch the news sentiment data from the API
    news_data = get_news_sentiment(tickers)

    # Check if data was fetched successfully
    if "error" in news_data:
        return jsonify(news_data), 500

    # Save the data to the database
    save_news_sentiment_to_db(news_data)

    return jsonify({"message": "News sentiment data saved successfully"}), 200


@stock_blueprint.route('/get_news_by_topic', methods=['GET'])
def get_news_by_topic_route():
    # Get the topic from the query parameter
    topic_name = request.args.get('topic')
    
    # Use the service to get the data
    result, error = get_news_by_topic(topic_name)
    
    if error:
        return jsonify({"error": error}), 400
    
    return jsonify(result), 200


@stock_blueprint.route('/get_topics', methods=['GET'])
def get_topics_route():
    # Call the service function to get all topics
    topics, error = get_all_topics()

    if error:
        return jsonify({"error": error}), 400 if error == "No topics found" else 500

    return jsonify(topics), 200


@stock_blueprint.route('/stock_performance', methods=['GET'])
def stock_performance_route():
    # Get the date, optional hour, and optional minute from the query parameters
    date_str = request.args.get('date')
    hour_str = request.args.get('hour')
    minute_str = request.args.get('minute')

    # Validate that the date is provided
    if not date_str:
        return jsonify({"error": "Date is required"}), 400

    # Call the service function to get stock performance
    performance_data, error = get_stock_performance(date_str, hour_str, minute_str)

    # If there was an error, return the error message
    if error:
        return jsonify({"error": error}), 500

    # Return the performance data in JSON format
    return jsonify(performance_data), 200


@stock_blueprint.route('/stock_performance_hour', methods=['GET'])
def stock_performance_hour_route():
    # Get the date, optional hour, and optional minute from the query parameters
    date_str = request.args.get('date')
    hour_str = request.args.get('hour')

    # Validate that the date is provided
    if not date_str:
        return jsonify({"error": "Date is required"}), 400

    # Call the service function to get stock performance
    performance_data, error = get_stock_performance_hour(date_str, hour_str)

    # If there was an error, return the error message
    if error:
        return jsonify({"error": error}), 500

    # Return the performance data in JSON format
    return jsonify(performance_data), 200



@stock_blueprint.route('/stock_qa', methods=['POST'])
def stock_qa():
    data = request.json
    question = data.get('question', '')
    symbol = data.get('symbol', '')

    if question and symbol:
        # Generate the stock QA response using the Groq LLM integration
        response = generate_stock_qa_response(question, symbol)
        return jsonify({"response": response}), 200

    return jsonify({"message": "Invalid input. Please provide a question and a stock symbol."}), 400