import os
import sys
from datetime import datetime, timedelta
import jwt
import bcrypt
import google.generativeai as genai
from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
load_dotenv()

# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from src.models.user import db
from src.routes.user import user_bp
from src.routes.prompt import prompt_bp
from src.routes.auth import auth_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = 'prompt-copilot-super-secret-key-2024'

# Enable CORS for all routes
CORS(app, origins="*")

# Database configuration - PostgreSQL for production, SQLite for development
DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///app.db')
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize Gemini AI
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# Register blueprints
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(prompt_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/api')

# Initialize database
db.init_app(app)

# Import all models to ensure they're registered
from src.models.prompt import Prompt
from src.models.analytics import Analytics

with app.app_context():
    db.create_all()

# API Routes for Prompt Enhancement
@app.route('/api/enhance-prompt', methods=['POST'])
def enhance_prompt():
    try:
        data = request.get_json()
        original_prompt = data.get('prompt', '')
        user_id = data.get('user_id')
        
        if not original_prompt:
            return jsonify({'error': 'Prompt is required'}), 400
        
        # Use Gemini to enhance the prompt
        model = genai.GenerativeModel('gemini-pro')
        enhancement_instruction = """
        Analyze and enhance this prompt to make it more effective for AI interactions. 
        Improve clarity, specificity, structure, and add helpful context. 
        Make it more likely to produce high-quality, detailed responses.
        Return only the enhanced prompt without explanations.
        
        Original prompt: {prompt}
        """
        
        response = model.generate_content(enhancement_instruction.format(prompt=original_prompt))
        enhanced_prompt = response.text.strip()
        
        # Save to database if user is logged in
        if user_id:
            prompt_record = Prompt(
                user_id=user_id,
                title=original_prompt[:50] + "..." if len(original_prompt) > 50 else original_prompt,
                body=original_prompt,
                original_text=original_prompt,
                enhanced_text=enhanced_prompt,
                category='general'
            )
            db.session.add(prompt_record)
            
            # Update analytics
            analytics = Analytics.query.filter_by(user_id=user_id).first()
            if not analytics:
                analytics = Analytics(user_id=user_id)
                db.session.add(analytics)
            
            analytics.prompts_enhanced += 1
            analytics.time_saved += 30  # Assume 30 seconds saved per enhancement
            analytics.total_usage += 1
            
            db.session.commit()
        
        return jsonify({
            'original': original_prompt,
            'enhanced': enhanced_prompt,
            'success': True
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'version': '2.0.0'
    })

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
        return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8002, debug=True)

