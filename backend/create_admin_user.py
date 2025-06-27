#!/usr/bin/env python3
"""
Script to create John Carmack admin user with premium features and sample data
"""
import os
import sys
import json
from datetime import datetime, timedelta

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

# Set environment variables
os.environ['DATABASE_URL'] = 'sqlite:///app.db'
os.environ['FLASK_ENV'] = 'development'

from src.main import create_app
from src.database import db
from src.models.user import User
from src.models.prompt import Prompt
from src.models.analytics import Analytics

def create_admin_user():
    """Create John Carmack admin user with premium features and sample data"""
    app = create_app()
    
    with app.app_context():
        print("🚀 Creating John Carmack admin user...\n")
        
        # Check if user already exists
        existing_user = User.query.filter_by(email="john@carmack.com").first()
        if existing_user:
            print("⚠️  User already exists! Updating existing user...")
            admin_user = existing_user
        else:
            # Create the admin user
            admin_user = User(
                name="John Carmack",
                username="jcarmack",
                email="john@carmack.com",
                is_premium=True  # Premium account
            )
            admin_user.set_password("RocketFuelTest123!")
            db.session.add(admin_user)
            print("✅ Created new admin user")
        
        # Set premium features and technique preferences
        admin_user.is_premium = True
        admin_user.technique_preferences = json.dumps({
            "zero_shot_cot": True,
            "few_shot_cot": True,
            "role_prompting": True,
            "xml_schema": True,
            "negative_prompts": True,
            "compression": True,
            "triple_prime": True,
            "self_consistency": True,
            "tree_of_thought": True,
            "program_aided": True,
            "rag_augmented": True,
            "reflection": True,
            "chain_verification": True,
            "contrastive": True,
            "voice_anchor": True,
            "temperature_scheduling": True,
            "dynamic_memory": True,
            "multimodal_cot": True,
            "iterative_decomposition": True,
            "ethical_constraints": True,
            "meta_prompts": True
        })
        
        db.session.commit()
        print("✅ Updated user with premium features")
        
        # Create sample prompts for the admin user
        print("\n📝 Creating sample prompts...")
        
        sample_prompts = [
            {
                "title": "3D Graphics Optimization",
                "body": "Optimize this 3D rendering pipeline for 60fps performance",
                "original_text": "Optimize 3D rendering",
                "enhanced_text": "Analyze and optimize this 3D rendering pipeline for consistent 60fps performance across target hardware. Focus on GPU utilization, memory bandwidth, draw call batching, and level-of-detail systems. Provide specific recommendations for vertex shaders, fragment shaders, and geometry culling techniques.",
                "category": "programming",
                "is_favorite": True,
                "effectiveness_score": 0.98,
                "usage_count": 12
            },
            {
                "title": "Game Engine Architecture",
                "body": "Design a modular game engine architecture for high-performance games",
                "original_text": "Design a game engine",
                "enhanced_text": "Architect a modular, high-performance game engine with emphasis on data-oriented design, entity-component-system architecture, and cache-friendly memory layouts. Include subsystems for rendering, physics, audio, input, and networking with clear interfaces and minimal coupling.",
                "category": "architecture",
                "is_favorite": True,
                "effectiveness_score": 0.96,
                "usage_count": 8
            },
            {
                "title": "Rocket Technology Analysis",
                "body": "Analyze the feasibility of reusable rocket technology for Mars missions",
                "original_text": "Analyze rocket technology",
                "enhanced_text": "Conduct a comprehensive technical analysis of reusable rocket technology for Mars missions. Evaluate propulsion systems, fuel efficiency, structural integrity, and cost-effectiveness. Consider atmospheric entry/exit challenges, refueling logistics, and mission timeline constraints.",
                "category": "engineering",
                "is_favorite": True,
                "effectiveness_score": 0.94,
                "usage_count": 15
            },
            {
                "title": "AI Training Optimization",
                "body": "Optimize neural network training for real-time inference",
                "original_text": "Optimize AI training",
                "enhanced_text": "Optimize neural network training pipelines for real-time inference deployment. Focus on quantization techniques, model pruning, knowledge distillation, and hardware acceleration. Provide specific strategies for maintaining accuracy while reducing computational overhead.",
                "category": "ai",
                "is_favorite": True,
                "effectiveness_score": 0.97,
                "usage_count": 20
            },
            {
                "title": "Virtual Reality Locomotion",
                "body": "Design intuitive VR locomotion systems that minimize motion sickness",
                "original_text": "Design VR locomotion",
                "enhanced_text": "Design intuitive virtual reality locomotion systems that minimize motion sickness while maintaining immersion. Explore teleportation, smooth locomotion, room-scale movement, and hybrid approaches. Consider comfort settings, accessibility, and different VR environments.",
                "category": "vr",
                "is_favorite": True,
                "effectiveness_score": 0.93,
                "usage_count": 7
            },
            {
                "title": "Distributed Systems Architecture",
                "body": "Design a fault-tolerant distributed system for multiplayer games",
                "original_text": "Design distributed system",
                "enhanced_text": "Architect a fault-tolerant distributed system for multiplayer games with emphasis on low-latency communication, conflict resolution, and graceful degradation. Include load balancing, data replication, and network partitioning strategies.",
                "category": "networking",
                "is_favorite": False,
                "effectiveness_score": 0.91,
                "usage_count": 5
            },
            {
                "title": "Physics Simulation Optimization",
                "body": "Optimize physics simulation for large-scale environments",
                "original_text": "Optimize physics simulation",
                "enhanced_text": "Optimize physics simulation systems for large-scale environments with thousands of dynamic objects. Focus on spatial partitioning, collision detection algorithms, constraint solving, and multi-threading approaches. Maintain simulation stability and determinism.",
                "category": "physics",
                "is_favorite": False,
                "effectiveness_score": 0.95,
                "usage_count": 9
            },
            {
                "title": "Startup Technical Strategy",
                "body": "Develop technical strategy for an AI-powered gaming startup",
                "original_text": "Develop technical strategy",
                "enhanced_text": "Develop a comprehensive technical strategy for an AI-powered gaming startup. Include technology stack selection, team structure, development methodologies, scalability planning, and risk mitigation. Focus on rapid prototyping and iterative development cycles.",
                "category": "strategy",
                "is_favorite": False,
                "effectiveness_score": 0.89,
                "usage_count": 3
            },
            {
                "title": "Code Performance Profiling",
                "body": "Profile and optimize C++ code for maximum performance",
                "original_text": "Profile C++ code",
                "enhanced_text": "Conduct comprehensive performance profiling of C++ code using advanced profiling tools. Identify bottlenecks in CPU usage, memory allocation, cache misses, and branch prediction. Provide specific optimization recommendations with measurable performance improvements.",
                "category": "optimization",
                "is_favorite": True,
                "effectiveness_score": 0.99,
                "usage_count": 25
            },
            {
                "title": "Mobile Game Architecture",
                "body": "Design efficient mobile game architecture for iOS and Android",
                "original_text": "Design mobile game architecture",
                "enhanced_text": "Design efficient mobile game architecture optimized for iOS and Android platforms. Consider battery life, thermal throttling, memory constraints, and diverse hardware capabilities. Include asset streaming, progressive loading, and platform-specific optimizations.",
                "category": "mobile",
                "is_favorite": False,
                "effectiveness_score": 0.92,
                "usage_count": 6
            }
        ]
        
        # Clear existing prompts for this user
        Prompt.query.filter_by(user_id=admin_user.id).delete()
        
        for prompt_data in sample_prompts:
            prompt = Prompt(
                user_id=admin_user.id,
                title=prompt_data["title"],
                body=prompt_data["body"],
                original_text=prompt_data["original_text"],
                enhanced_text=prompt_data["enhanced_text"],
                category=prompt_data["category"],
                is_favorite=prompt_data["is_favorite"],
                effectiveness_score=prompt_data["effectiveness_score"],
                usage_count=prompt_data["usage_count"]
            )
            db.session.add(prompt)
        
        db.session.commit()
        print(f"✅ Created {len(sample_prompts)} sample prompts")
        
        # Create analytics data
        print("\n📊 Creating analytics data...")
        
        # Clear existing analytics
        Analytics.query.filter_by(user_id=admin_user.id).delete()
        
        analytics = Analytics(
            user_id=admin_user.id,
            prompts_enhanced=len(sample_prompts),
            time_saved=3600,  # 1 hour saved
            success_rate=0.96,
            total_usage=sum(p["usage_count"] for p in sample_prompts),
            last_activity=datetime.utcnow(),
            created_at=datetime.utcnow() - timedelta(days=30)
        )
        
        db.session.add(analytics)
        db.session.commit()
        print("✅ Created analytics data")
        
        # Display summary
        print("\n🎯 John Carmack Admin Account Summary:")
        print(f"   👤 Name: {admin_user.name}")
        print(f"   📧 Email: {admin_user.email}")
        print(f"   🔑 Username: {admin_user.username}")
        print(f"   💎 Premium: {'Yes' if admin_user.is_premium else 'No'}")
        print(f"   📝 Prompts: {Prompt.query.filter_by(user_id=admin_user.id).count()}")
        print(f"   ⭐ Favorites: {len([p for p in sample_prompts if p['is_favorite']])}")
        print(f"   📊 Total Usage: {sum(p['usage_count'] for p in sample_prompts)}")
        print(f"   🎯 Avg Effectiveness: {sum(p['effectiveness_score'] for p in sample_prompts) / len(sample_prompts):.2%}")
        print(f"   ⏱️  Time Saved: {analytics.time_saved} seconds")
        
        print("\n🚀 Login Credentials:")
        print(f"   Email: john@carmack.com")
        print(f"   Password: RocketFuelTest123!")
        
        print("\n✨ Premium Features Enabled:")
        print("   • All 21 prompt techniques")
        print("   • Unlimited favorites")
        print("   • Advanced analytics")
        print("   • Priority support")
        
        print("\n🎉 John Carmack admin user created successfully!")

if __name__ == '__main__':
    create_admin_user() 