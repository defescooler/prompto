#!/usr/bin/env python3
"""
Prompto Sample Account Generator
Cleans existing accounts and creates Donald Trump sample account with metrics
"""

import sys
import os
from datetime import datetime, timedelta
import random

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from src.database import db
from src.main import create_app
from src.models.user import User
from src.models.analytics import Analytics
from src.models.prompt import Prompt
import json

def create_sample_metrics(user_id):
    """Generate realistic sample metrics and prompts for the sample account"""
    
    # Create analytics record
    analytics = Analytics(
        user_id=user_id,
        prompts_enhanced=247,
        time_saved=4320,  # 72 minutes in seconds
        success_rate=94.2,
        total_usage=267,
        last_activity=datetime.utcnow()
    )
    
    # Sample prompts
    sample_prompts = [
        {
            'title': 'Marketing Strategy Review',
            'body': 'Create a comprehensive marketing strategy for launching a new social media platform targeting Gen Z users. Include market analysis, competitor research, budget allocation, user acquisition strategies, and key performance indicators for measuring success.',
            'original_text': 'Make marketing plan for social app',
            'enhanced_text': 'Create a comprehensive marketing strategy for launching a new social media platform targeting Gen Z users. Include market analysis, competitor research, budget allocation, user acquisition strategies, and key performance indicators for measuring success.',
            'effectiveness_score': 9.2,
            'category': 'business',
            'usage_count': 12
        },
        {
            'title': 'Technical Documentation Guide',
            'body': 'Write detailed API documentation for a REST endpoint that handles user authentication, including request/response examples, error codes, security considerations, rate limiting, and best practices for implementation.',
            'original_text': 'Document the login API',
            'enhanced_text': 'Write detailed API documentation for a REST endpoint that handles user authentication, including request/response examples, error codes, security considerations, rate limiting, and best practices for implementation.',
            'effectiveness_score': 8.7,
            'category': 'technical',
            'usage_count': 8
        },
        {
            'title': 'Customer Support Excellence',
            'body': 'Develop a customer support conversation script for handling billing inquiries, ensuring empathy, clear explanations, resolution pathways, escalation procedures, and follow-up protocols to maintain customer satisfaction.',
            'original_text': 'Help with customer billing questions',
            'enhanced_text': 'Develop a customer support conversation script for handling billing inquiries, ensuring empathy, clear explanations, resolution pathways, escalation procedures, and follow-up protocols to maintain customer satisfaction.',
            'effectiveness_score': 8.9,
            'category': 'business',
            'usage_count': 15
        },
        {
            'title': 'AI Ethics Framework',
            'body': 'Design a comprehensive ethical framework for AI development that addresses bias, transparency, accountability, privacy, and societal impact while ensuring practical implementation guidelines.',
            'original_text': 'AI ethics rules',
            'enhanced_text': 'Design a comprehensive ethical framework for AI development that addresses bias, transparency, accountability, privacy, and societal impact while ensuring practical implementation guidelines.',
            'effectiveness_score': 9.5,
            'category': 'technology',
            'usage_count': 22
        },
        {
            'title': 'Investment Portfolio Analysis',
            'body': 'Provide a detailed analysis of a diversified investment portfolio including risk assessment, performance metrics, rebalancing recommendations, and strategic adjustments for market volatility.',
            'original_text': 'Check my investments',
            'enhanced_text': 'Provide a detailed analysis of a diversified investment portfolio including risk assessment, performance metrics, rebalancing recommendations, and strategic adjustments for market volatility.',
            'effectiveness_score': 8.8,
            'category': 'finance',
            'usage_count': 6
        }
    ]
    
    return analytics, sample_prompts

def cleanup_and_create_sample():
    """Remove all users and create the Donald Trump sample account"""
    
    print("🧹 Cleaning existing accounts...")
    
    # Clear all existing data
    Analytics.query.delete()
    Prompt.query.delete()
    User.query.delete()
    db.session.commit()
    
    print("✅ Cleaned all existing accounts")
    
    # Create Donald Trump sample account
    print("👑 Creating Donald Trump sample account...")
    
    sample_user = User(
        name='Donald Trump',
        username='dtrump',
        email='arsen.kozhabekof@gmail.com',
        is_premium=True,
        created_at=datetime.utcnow() - timedelta(days=30),
        technique_preferences=json.dumps({
            'clarity': True,
            'specificity': True,
            'context': True,
            'examples': True,
            'structure': True
        })
    )
    
    # Set password using the user method
    sample_user.set_password('P@ssw0rd123')
    
    db.session.add(sample_user)
    db.session.flush()  # Get the user ID
    
    # Generate sample analytics and prompts
    analytics, sample_prompts = create_sample_metrics(sample_user.id)
    
    # Add analytics
    db.session.add(analytics)
    
    # Add sample prompts
    for prompt_data in sample_prompts:
        prompt = Prompt(
            user_id=sample_user.id,
            title=prompt_data['title'],
            body=prompt_data['body'],
            original_text=prompt_data['original_text'],
            enhanced_text=prompt_data['enhanced_text'],
            effectiveness_score=prompt_data['effectiveness_score'],
            category=prompt_data['category'],
            usage_count=prompt_data['usage_count'],
            is_favorite=True,
            created_at=datetime.utcnow() - timedelta(days=random.randint(1, 15))
        )
        db.session.add(prompt)
    
    db.session.commit()
    
    print(f"✅ Created sample account: {sample_user.username}")
    print(f"📊 Added analytics record")
    print(f"💾 Added {len(sample_prompts)} sample prompts")
    print(f"📧 Email: {sample_user.email}")
    print(f"🔑 Password: P@ssw0rd123")

def main():
    """Main execution function"""
    app = create_app('development')
    
    with app.app_context():
        cleanup_and_create_sample()
        print("\n🎉 Sample account setup complete!")

if __name__ == '__main__':
    main() 