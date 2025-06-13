#!/usr/bin/env python3
"""
Simple script to initialize the database
"""
import os
import sys

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

# Set environment variables
os.environ['DATABASE_URL'] = 'sqlite:///app.db'
os.environ['FLASK_ENV'] = 'development'

from src.main import create_app
from src.database import db

def init_database():
    """Initialize the database"""
    app = create_app()
    
    with app.app_context():
        # Create all tables
        db.create_all()
        print("✅ Database initialized successfully!")
        print("📁 Database file: app.db")
        
        # Show tables
        from sqlalchemy import inspect
        inspector = inspect(db.engine)
        tables = inspector.get_table_names()
        print(f"📋 Created tables: {', '.join(tables)}")

if __name__ == '__main__':
    init_database() 