from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

# Initialize SQLAlchemy
db = SQLAlchemy()

# Initialize Flask-Migrate
migrate = Migrate()

def init_app(app):
    """Initialize database with Flask app"""
    db.init_app(app)
    migrate.init_app(app, db) 