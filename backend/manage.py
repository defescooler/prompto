#!/usr/bin/env python3
"""
Flask application management script for database migrations
"""
import os
import sys
from flask.cli import FlaskGroup
from src.main import create_app
from src.database import db, migrate

# Add the src directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

# Create Flask CLI group
cli = FlaskGroup(create_app=create_app)

@cli.command()
def init_db():
    """Initialize the database."""
    with create_app().app_context():
        db.create_all()
        print("Database initialized!")

@cli.command()
def drop_db():
    """Drop the database."""
    with create_app().app_context():
        db.drop_all()
        print("Database dropped!")

@cli.command()
def reset_db():
    """Reset the database."""
    with create_app().app_context():
        db.drop_all()
        db.create_all()
        print("Database reset!")

if __name__ == '__main__':
    cli() 