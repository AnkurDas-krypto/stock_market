from app import db

class NewsSentiment(db.Model):
    __tablename__ = 'news_sentiment'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    url = db.Column(db.String, nullable=False)
    summary = db.Column(db.Text, nullable=False)
    time_published = db.Column(db.String, nullable=False)
    source = db.Column(db.String, nullable=False)
    source_domain = db.Column(db.String, nullable=False)
    overall_sentiment_label = db.Column(db.String, nullable=False)
    overall_sentiment_score = db.Column(db.Float, nullable=False)
    banner_image = db.Column(db.String)

    # Relationship to other models
    authors = db.relationship('NewsAuthor', backref='news_sentiment', lazy=True)
    tickers = db.relationship('TickerSentiment', backref='news_sentiment', lazy=True)
    topics = db.relationship('NewsTopic', backref='news_sentiment', lazy=True)

class NewsAuthor(db.Model):
    __tablename__ = 'news_author'
    id = db.Column(db.Integer, primary_key=True)
    author_name = db.Column(db.String, nullable=False)
    news_sentiment_id = db.Column(db.Integer, db.ForeignKey('news_sentiment.id'), nullable=False)

class TickerSentiment(db.Model):
    __tablename__ = 'ticker_sentiment'
    id = db.Column(db.Integer, primary_key=True)
    ticker = db.Column(db.String, nullable=False)
    relevance_score = db.Column(db.Float, nullable=False)
    ticker_sentiment_label = db.Column(db.String, nullable=False)
    ticker_sentiment_score = db.Column(db.Float, nullable=False)
    news_sentiment_id = db.Column(db.Integer, db.ForeignKey('news_sentiment.id'), nullable=False)

class NewsTopic(db.Model):
    __tablename__ = 'news_topic'
    id = db.Column(db.Integer, primary_key=True)
    topic = db.Column(db.String, nullable=False)
    relevance_score = db.Column(db.Float, nullable=False)
    news_sentiment_id = db.Column(db.Integer, db.ForeignKey('news_sentiment.id'), nullable=False)
