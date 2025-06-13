#!/usr/bin/env python3
"""
Script to populate PostgreSQL database with sample data for DataGrip testing
"""
import psycopg2
from datetime import datetime
import bcrypt

# Database connection parameters
DB_PARAMS = {
    'host': 'localhost',
    'port': 5432,
    'database': 'prompt_copilot_db',
    'user': 'prompt_user',
    'password': 'prompt_password_2024_dev'
}

def create_tables():
    """Create the database tables"""
    conn = psycopg2.connect(**DB_PARAMS)
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            username VARCHAR(100) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_premium BOOLEAN DEFAULT FALSE,
            oauth_google_id VARCHAR(255),
            oauth_github_id VARCHAR(255)
        )
    """)
    
    # Create prompt_drafts table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS prompt_drafts (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            body TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Create prompts table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS prompts (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            title VARCHAR(255) NOT NULL,
            body TEXT NOT NULL,
            original_text TEXT,
            enhanced_text TEXT,
            category VARCHAR(100) DEFAULT 'general',
            is_favorite BOOLEAN DEFAULT FALSE,
            effectiveness_score FLOAT DEFAULT 0.0,
            usage_count INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Create analytics table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS analytics (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) NOT NULL,
            prompts_enhanced INTEGER DEFAULT 0,
            time_saved INTEGER DEFAULT 0,
            success_rate FLOAT DEFAULT 0.0,
            total_usage INTEGER DEFAULT 0,
            last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    conn.commit()
    cursor.close()
    conn.close()
    print("✅ Tables created successfully!")

def insert_sample_data():
    """Insert sample data"""
    conn = psycopg2.connect(**DB_PARAMS)
    cursor = conn.cursor()
    
    # Clear existing data
    cursor.execute("DELETE FROM analytics")
    cursor.execute("DELETE FROM prompts")
    cursor.execute("DELETE FROM prompt_drafts")
    cursor.execute("DELETE FROM users")
    
    # Insert sample users
    password_hash = bcrypt.hashpw("password123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    cursor.execute("""
        INSERT INTO users (name, username, email, password_hash, is_premium)
        VALUES 
        ('John Doe', 'johndoe', 'john@example.com', %s, TRUE),
        ('Jane Smith', 'janesmith', 'jane@example.com', %s, FALSE),
        ('Bob Wilson', 'bobwilson', 'bob@example.com', %s, FALSE)
        RETURNING id
    """, (password_hash, password_hash, password_hash))
    
    user_ids = [row[0] for row in cursor.fetchall()]
    print(f"✅ Created {len(user_ids)} users")
    
    # Insert sample prompt drafts
    drafts = [
        ('AI Writing Assistant', 'You are a professional writing assistant. Help me write clear, engaging content for my blog posts.'),
        ('Code Review Helper', 'You are an expert code reviewer. Analyze this code and provide constructive feedback on style, efficiency, and best practices.'),
        ('Data Analysis Prompt', 'You are a data analyst. Help me analyze this dataset and provide insights about trends, patterns, and recommendations.'),
        ('Creative Story Generator', 'You are a creative writer. Help me develop an engaging story with interesting characters and plot twists.'),
        ('Technical Documentation', 'You are a technical writer. Help me create clear, comprehensive documentation for this software project.')
    ]
    
    for title, body in drafts:
        cursor.execute("""
            INSERT INTO prompt_drafts (title, body)
            VALUES (%s, %s)
        """, (title, body))
    
    print(f"✅ Created {len(drafts)} prompt drafts")
    
    # Insert sample enhanced prompts
    enhanced_prompts = [
        (user_ids[0], 'Blog Post Introduction', 'Write an engaging introduction for a blog post about AI in healthcare',
         'Write an introduction for a blog post about AI in healthcare',
         'Craft a compelling and engaging introduction for a blog post exploring the transformative impact of artificial intelligence in healthcare. Focus on capturing the reader\'s attention with a thought-provoking opening that highlights both the promise and challenges of AI-driven medical innovations.',
         'writing', True, 0.95, 3),
        (user_ids[0], 'Python Code Review', 'Review this Python function for efficiency and best practices',
         'Review this Python function',
         'Conduct a comprehensive code review of this Python function, analyzing it for efficiency, readability, adherence to PEP 8 standards, error handling, and potential optimizations. Provide specific suggestions for improvement.',
         'programming', False, 0.88, 1),
        (user_ids[1], 'Marketing Email', 'Create a persuasive marketing email for a new product launch',
         'Write a marketing email',
         'Compose a compelling and persuasive marketing email for a new product launch. Focus on creating urgency, highlighting unique value propositions, and including a clear call-to-action that drives conversions.',
         'marketing', True, 0.92, 5)
    ]
    
    for user_id, title, body, original, enhanced, category, favorite, score, usage in enhanced_prompts:
        cursor.execute("""
            INSERT INTO prompts (user_id, title, body, original_text, enhanced_text, category, is_favorite, effectiveness_score, usage_count)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (user_id, title, body, original, enhanced, category, favorite, score, usage))
    
    print(f"✅ Created {len(enhanced_prompts)} enhanced prompts")
    
    # Insert sample analytics
    analytics = [
        (user_ids[0], 15, 450, 0.94, 25),
        (user_ids[1], 8, 240, 0.89, 12),
        (user_ids[2], 3, 90, 0.85, 5)
    ]
    
    for user_id, enhanced, time_saved, success_rate, total_usage in analytics:
        cursor.execute("""
            INSERT INTO analytics (user_id, prompts_enhanced, time_saved, success_rate, total_usage)
            VALUES (%s, %s, %s, %s, %s)
        """, (user_id, enhanced, time_saved, success_rate, total_usage))
    
    print(f"✅ Created {len(analytics)} analytics records")
    
    conn.commit()
    cursor.close()
    conn.close()

def show_summary():
    """Show database summary"""
    conn = psycopg2.connect(**DB_PARAMS)
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM users")
    user_count = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM prompt_drafts")
    draft_count = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM prompts")
    prompt_count = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM analytics")
    analytics_count = cursor.fetchone()[0]
    
    cursor.close()
    conn.close()
    
    print("\n📊 Database Summary:")
    print(f"   Users: {user_count}")
    print(f"   Prompt Drafts: {draft_count}")
    print(f"   Enhanced Prompts: {prompt_count}")
    print(f"   Analytics: {analytics_count}")

if __name__ == '__main__':
    print("🎯 Populating PostgreSQL database with sample data...\n")
    
    try:
        create_tables()
        insert_sample_data()
        show_summary()
        
        print("\n🎉 Database populated successfully!")
        print("💡 You can now connect DataGrip to:")
        print("   Host: localhost")
        print("   Port: 5432")
        print("   Database: prompt_copilot_db")
        print("   User: prompt_user")
        print("   Password: prompt_password_2024_dev")
        
    except Exception as e:
        print(f"❌ Error: {e}") 