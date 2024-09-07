from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from app.config import Config
from flask_cors import CORS

# Initialize SQLAlchemy instance
db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(Config)

    # Initialize SQLAlchemy with the app context
    db.init_app(app)

    # Register blueprints and other extensions
    from app.routes.stock_routes import stock_blueprint
    app.register_blueprint(stock_blueprint)

    # Create tables if not already created
    with app.app_context():
        db.create_all()  # Automatically creates tables based on models

    return app
