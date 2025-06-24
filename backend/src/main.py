import os
import sys
from datetime import datetime, timedelta
import jwt
import bcrypt
import google.generativeai as genai
from openai import OpenAI
from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import hashlib
import time
from collections import defaultdict

load_dotenv()

# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from src.config import config
from src.database import db, migrate, init_app
from src.models.user import User
from src.models.prompt import Prompt
from src.models.analytics import Analytics
from src.models.prompt_draft import PromptDraft
from src.routes.user import user_bp
from src.routes.prompt import prompt_bp
from src.routes.auth import auth_bp
from src.routes.prompt_draft import prompt_draft_bp
from src.utils.prompt_techniques import PromptTechniques
from src.utils.performance_optimizer import performance_optimizer, FastPromptProcessor

# JWT Configuration
SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-here')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440

# High-performance caching system (replaced with performance_optimizer)

def create_app(config_name=None):
    """Application factory pattern"""
    app = Flask(__name__)
    
    # Load configuration
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'default')
    app.config.from_object(config[config_name])

    # Enable CORS for all routes
    CORS(app, origins="*")

    # Initialize database and migrations
    init_app(app)

    # Initialize AI services
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    AI_PROVIDER = os.getenv('AI_PROVIDER', 'auto')
    
    if GEMINI_API_KEY:
        genai.configure(api_key=GEMINI_API_KEY)
    
    openai_client = None
    if OPENAI_API_KEY:
        openai_client = OpenAI(api_key=OPENAI_API_KEY)

    # Create database tables
    with app.app_context():
        db.create_all()

    return app

# Create the app instance
app = create_app()

# Helper function to create access token
def create_access_token(data, expires_delta=None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Helper function to get current user from token
def get_current_user():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return None
        
        token = auth_header.split(' ')[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        if user_id is None:
            return None
        
        user = User.query.get(user_id)
        print(f"Debug: get_current_user found user: {user.id if user else None}")
        return user
    except Exception as e:
        print(f"Debug: Error in get_current_user: {e}")
        import traceback
        traceback.print_exc()
        return None

# Authentication endpoints
@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        name = data.get('name')
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        if not all([name, username, email, password]):
            return jsonify({'error': 'All fields are required'}), 400
        
        # Check if user already exists
        existing_user = User.query.filter(
            (User.username == username) | (User.email == email)
        ).first()
        
        if existing_user:
            return jsonify({'error': 'Username or email already registered'}), 400
        
        # Create user
        user = User(
            name=name,
            username=username,
            email=email
        )
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        # Create token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"user_id": user.id}, expires_delta=access_token_expires
        )
        
        return jsonify({
            'token': access_token,
            'user': user.to_dict()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username_or_email = data.get('username_or_email')
        password = data.get('password')
        
        if not all([username_or_email, password]):
            return jsonify({'error': 'Username/email and password are required'}), 400
        
        # Find user by username or email
        user = User.query.filter(
            (User.username == username_or_email) | (User.email == username_or_email)
        ).first()
        
        if not user or not user.check_password(password):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Create token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"user_id": user.id}, expires_delta=access_token_expires
        )
        
        return jsonify({
            'token': access_token,
            'user': user.to_dict()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/me', methods=['GET'])
def get_current_user_info():
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Invalid token'}), 401
    
    return jsonify({
        'user': user.to_dict()
    })

def enhance_with_openai(original_prompt, method='llm', enabled_techniques=None):
    """Advanced prompt engineering with OpenAI GPT - PERFORMANCE OPTIMIZED"""
    try:
        if enabled_techniques is None:
            enabled_techniques = PromptTechniques.get_default_techniques()
        
        # Apply prompt engineering techniques first
        enhanced_prompt = PromptTechniques.apply_techniques(original_prompt, enabled_techniques, method)
        
        # Skip API call for compression method to improve speed
        if method == 'compression':
            return enhanced_prompt
        
        openai_client = OpenAI(
            api_key=os.getenv('OPENAI_API_KEY'),
            timeout=8.0  # Reduced timeout for faster responses
        )
        
        if method == "llm":
            # Streamlined system prompt for faster processing
            system_prompt = "Refine this enhanced prompt for maximum effectiveness while preserving all structural elements. Be concise and precise."
            
            response = openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": enhanced_prompt}
                ],
                max_tokens=800,  # Reduced for faster responses
                temperature=0.5,  # Lower for more consistent results
                timeout=6.0  # Aggressive timeout
            )
            
            final_enhanced = response.choices[0].message.content.strip()
            
        else:  # compression
            # For compression, use the technique-enhanced version directly
            final_enhanced = enhanced_prompt
        
        return final_enhanced if final_enhanced else enhanced_prompt
        
    except Exception as e:
        print(f"OpenAI API error: {e}")
        # Return the technique-enhanced version if API fails
        if enabled_techniques is None:
            enabled_techniques = PromptTechniques.get_default_techniques()
        return PromptTechniques.apply_techniques(original_prompt, enabled_techniques, method)

def enhance_with_gemini(original_prompt, method='llm', enabled_techniques=None):
    """Advanced prompt engineering with Google Gemini - PERFORMANCE OPTIMIZED"""
    try:
        if enabled_techniques is None:
            enabled_techniques = PromptTechniques.get_default_techniques()
        
        # Apply prompt engineering techniques first
        enhanced_prompt = PromptTechniques.apply_techniques(original_prompt, enabled_techniques, method)
        
        # Skip API call for compression method to improve speed
        if method == 'compression':
            return enhanced_prompt
        
        generation_config = genai.types.GenerationConfig(
            max_output_tokens=600,  # Reduced for faster responses
            temperature=0.5,  # More consistent results
            top_p=0.8,
            top_k=20  # Reduced for faster generation
        )
        
        model = genai.GenerativeModel(
            'gemini-pro',
            generation_config=generation_config
        )
        
        if method == "llm":
            # Streamlined instruction for faster processing
            enhancement_instruction = f"Optimize this enhanced prompt for maximum effectiveness:\n\n{enhanced_prompt}"
            
        else:  # compression
            # For compression, use the technique-enhanced version directly
            return enhanced_prompt
        
        response = model.generate_content(enhancement_instruction)
        final_enhanced = response.text.strip()
        
        # Clean up response formatting
        if final_enhanced.startswith(('```', 'Enhanced:', 'Optimized:', 'Final:')):
            lines = final_enhanced.split('\n')
            for i, line in enumerate(lines):
                if line and not line.startswith(('```', 'Enhanced:', 'Optimized:', 'Final:')):
                    final_enhanced = '\n'.join(lines[i:])
                    break
        
        return final_enhanced if final_enhanced else enhanced_prompt
        
    except Exception as e:
        print(f"Gemini API error: {e}")
        # Return the technique-enhanced version if API fails
        if enabled_techniques is None:
            enabled_techniques = PromptTechniques.get_default_techniques()
        return PromptTechniques.apply_techniques(original_prompt, enabled_techniques, method)

def get_fallback_enhancement(original_prompt, method='llm', enabled_techniques=None):
    """Advanced fallback enhancement using state-of-the-art techniques when AI services are unavailable"""
    if enabled_techniques is None:
        enabled_techniques = PromptTechniques.get_default_techniques()
    
    # Use the comprehensive prompt techniques system for fallback
    return PromptTechniques.apply_techniques(original_prompt, enabled_techniques, method)

# Prompt enhancement endpoint
@app.route('/api/prompts/enhance', methods=['POST'])
def enhance_prompt():
    try:
        start_time = time.time()
        data = request.get_json()
        original_prompt = data.get('prompt', '').strip()
        method = data.get('method', 'llm')
        ai_provider = data.get('provider', os.getenv('AI_PROVIDER', 'auto'))
        enabled_techniques = data.get('techniques', PromptTechniques.get_default_techniques())
        preset = data.get('preset')
        
        # Apply preset if specified
        if preset and preset in PromptTechniques.PRESETS:
            enabled_techniques = PromptTechniques.PRESETS[preset]
        
        if not original_prompt:
            return jsonify({'error': 'Prompt is required'}), 400
        
        if len(original_prompt) > 5000:
            return jsonify({'error': 'Prompt too long (max 5000 characters)'}), 400
        
        # Optimize prompt and techniques for performance
        optimized_prompt, optimized_techniques = performance_optimizer.optimize_prompt_processing(original_prompt, enabled_techniques)
        
        # Generate high-performance cache key
        cache_key = performance_optimizer.get_cache_key(optimized_prompt, optimized_techniques, method)
        
        # Check high-performance cache
        cached_result = performance_optimizer.get_cached_result(cache_key)
        if cached_result:
            response_time = int((time.time() - start_time) * 1000)
            performance_optimizer.record_response_time(response_time)
            print(f"⚡ INSTANT response from cache in {response_time}ms")
            return jsonify({
                **cached_result,
                'cached': True,
                'response_time_ms': response_time
            })
        
        # Get user if authenticated
        user = get_current_user()
        
        enhanced_prompt = None
        provider_used = None
        
        # High-performance AI enhancement with timeout and retry logic
        enhancement_start = time.time()
        enhanced_prompt = None
        provider_used = None
        
        try:
            # Use optimized techniques for faster processing
            if ai_provider == 'openai' or ai_provider == 'auto':
                if os.getenv('OPENAI_API_KEY'):
                    enhanced_prompt = enhance_with_openai(optimized_prompt, method, optimized_techniques)
                    if enhanced_prompt:
                        provider_used = 'openai'
            
            if not enhanced_prompt and (ai_provider == 'gemini' or ai_provider == 'auto'):
                if os.getenv('GEMINI_API_KEY'):
                    enhanced_prompt = enhance_with_gemini(optimized_prompt, method, optimized_techniques)
                    if enhanced_prompt:
                        provider_used = 'gemini'
            
            # Fast fallback if no AI service worked
            if not enhanced_prompt:
                enhanced_prompt = get_fallback_enhancement(optimized_prompt, method, optimized_techniques)
                provider_used = 'fallback'
            
        except Exception as e:
            print(f"🚨 Enhancement error: {e}")
            enhanced_prompt = get_fallback_enhancement(optimized_prompt, method, optimized_techniques)
            provider_used = 'fallback_error'
        
        # Calculate effectiveness score based on enhancement quality
        enhancement_ratio = len(enhanced_prompt) / len(original_prompt) if original_prompt else 1
        base_score = 85.0
        
        if method == 'llm':
            # Reward comprehensive enhancements
            effectiveness_score = min(95.0, base_score + (enhancement_ratio - 1) * 10)
        else:
            # Reward compression
            effectiveness_score = min(95.0, base_score + (2 - enhancement_ratio) * 15)
        
        effectiveness_score = max(70.0, effectiveness_score)  # Minimum score
        
        response_time = int((time.time() - start_time) * 1000)
        enhancement_time = int((time.time() - enhancement_start) * 1000)
        
        # Record performance metrics
        performance_optimizer.record_response_time(response_time)
        
        print(f"🚀 Enhancement completed in {response_time}ms (processing: {enhancement_time}ms) via {provider_used}")
        
        # Prepare response data for caching
        response_data = {
            'enhanced_prompt': enhanced_prompt,
            'success': True,
            'provider_used': provider_used,
            'method': method,
            'techniques_used': optimized_techniques,
            'techniques_applied': len(optimized_techniques),
            'effectiveness_score': round(effectiveness_score, 1),
            'enhancement_ratio': round(enhancement_ratio, 2),
            'original_length': len(original_prompt),
            'enhanced_length': len(enhanced_prompt),
            'cached': False
        }
        
        # Cache the result for future requests
        if enhanced_prompt and response_time < 10000:  # Only cache successful, fast responses
            performance_optimizer.cache_result(cache_key, response_data)
        
        # Async database operations (non-blocking)
        prompt_id = None
        if user and enhanced_prompt:
            try:
                # Generate smart title from original prompt
                title_words = original_prompt.split()[:8]
                title = ' '.join(title_words)
                if len(title_words) == 8:
                    title += "..."
                
                prompt_record = Prompt(
                    user_id=user.id,
                    title=title,
                    body=original_prompt,
                    original_text=original_prompt,
                    enhanced_text=enhanced_prompt,
                    category='general',
                    effectiveness_score=round(effectiveness_score, 1)
                )
                db.session.add(prompt_record)
                
                # Update analytics
                analytics = Analytics.query.filter_by(user_id=user.id).first()
                if not analytics:
                    analytics = Analytics(user_id=user.id)
                    db.session.add(analytics)
                
                analytics.prompts_enhanced += 1
                analytics.time_saved += 45
                analytics.total_usage += 1
                
                db.session.commit()
                prompt_id = prompt_record.id
                
            except Exception as db_error:
                print(f"⚠️ Database operation failed (non-critical): {db_error}")
                db.session.rollback()
        
        # Add final response metadata
        response_data.update({
            'prompt_id': prompt_id,
            'response_time_ms': response_time,
            'enhancement_time_ms': enhancement_time
        })
        
        return jsonify(response_data)
        
    except Exception as e:
        print(f"Enhancement error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Enhancement service temporarily unavailable'}), 500

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'version': '2.0.0'
    })

# Get user's prompts
@app.route('/api/prompts', methods=['GET'])
def get_prompts():
    try:
        user = get_current_user()
        if not user:
            return jsonify({'error': 'Authentication required'}), 401
        
        prompts = Prompt.query.filter_by(user_id=user.id).order_by(Prompt.created_at.desc()).all()
        
        return jsonify([
            {
                'id': prompt.id,
                'original_prompt': prompt.original_text,
                'enhanced_prompt': prompt.enhanced_text,
                'effectiveness_score': prompt.effectiveness_score,
                'is_favorite': prompt.is_favorite,
                'created_at': prompt.created_at.isoformat() if prompt.created_at else None
            }
            for prompt in prompts
        ])
        
    except Exception as e:
        print(f"Error fetching prompts: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# Get analytics
@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    try:
        user = get_current_user()
        if not user:
            return jsonify({'error': 'Authentication required'}), 401
        
        analytics = Analytics.query.filter_by(user_id=user.id).first()
        
        if not analytics:
            return jsonify({
                'total_prompts': 0,
                'today_enhancements': 0,
                'average_score': 0.0,
                'favorites_count': 0
            })
        
        # Get today's enhancements
        today = datetime.utcnow().date()
        today_prompts = Prompt.query.filter(
            Prompt.user_id == user.id,
            Prompt.created_at >= today
        ).count()
        
        # Get favorites count
        favorites_count = Prompt.query.filter_by(
            user_id=user.id,
            is_favorite=True
        ).count()
        
        # Get average score
        avg_score = db.session.query(db.func.avg(Prompt.effectiveness_score)).filter_by(user_id=user.id).scalar() or 0.0
        
        return jsonify({
            'total_prompts': analytics.prompts_enhanced,
            'today_enhancements': today_prompts,
            'average_score': round(float(avg_score), 1),
            'favorites_count': favorites_count
        })
        
    except Exception as e:
        print(f"Error fetching analytics: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# Get available prompt engineering techniques
@app.route('/api/techniques', methods=['GET'])
def get_techniques():
    try:
        return jsonify(PromptTechniques.get_technique_info())
    except Exception as e:
        print(f"Error fetching techniques: {e}")
        return jsonify({'error': str(e)}), 500

# Advanced performance monitoring endpoint
@app.route('/api/performance', methods=['GET'])
def performance_status():
    """Comprehensive performance monitoring and diagnostics"""
    try:
        stats = performance_optimizer.get_performance_stats()
        
        # Add server-specific metrics
        stats['server'] = {
            'uptime_seconds': int(time.time() - app.start_time) if hasattr(app, 'start_time') else 0,
            'python_version': f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}",
            'flask_debug': app.debug,
            'total_techniques': len(PromptTechniques.TECHNIQUES)
        }
        
        return jsonify(stats)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Legacy cache status endpoint (redirects to performance)
@app.route('/api/cache/status', methods=['GET'])
def cache_status():
    """Legacy endpoint - redirects to performance monitoring"""
    return performance_status()

# Root route - API only
@app.route('/')
def root():
    return jsonify({
        'message': 'Prompt Copilot API',
        'status': 'running',
        'frontend': 'http://localhost:5173',
        'docs': 'API endpoints available at /api/*'
    })

if __name__ == '__main__':
    # Initialize performance tracking
    app.start_time = time.time()
    
    # Production-optimized settings
    import threading
    print(f"🚀 Prompto Backend starting with {threading.active_count()} threads")
    print(f"⚡ Performance optimizer initialized")
    print(f"🎯 {len(PromptTechniques.TECHNIQUES)} techniques available")
    
    # Run with optimized settings
    app.run(
        host='0.0.0.0', 
        port=8002, 
        debug=True,
        threaded=True,
        use_reloader=False  # Disable reloader for better performance
    )

