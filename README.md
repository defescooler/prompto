# 🚀 Prompt Copilot

**AI-Powered Prompt Enhancement System with Chrome Extension & Web Dashboard**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![React 18](https://img.shields.io/badge/react-18.2-blue.svg)](https://reactjs.org/)
[![Chrome Extension](https://img.shields.io/badge/chrome-extension-green.svg)](https://developer.chrome.com/docs/extensions/)

> Transform your AI prompts with intelligent enhancement, cross-platform synchronization, and powerful analytics.

## ✨ Features

### 🔌 **Chrome Extension**
- **Smart Detection** - Automatically detects typing in ChatGPT, Claude, Gemini, and other AI platforms
- **One-Click Enhancement** - Improve prompts with AI-powered suggestions
- **Real-time Sync** - Seamlessly syncs with web dashboard
- **Cross-Platform** - Works across all major AI platforms

### 🌐 **Web Dashboard**
- **Modern UI** - Beautiful, responsive interface with dark theme
- **Analytics Dashboard** - Track usage, improvements, and success rates
- **Prompt Library** - Save, organize, and manage your enhanced prompts
- **Keyboard Shortcuts** - Professional shortcuts (Ctrl+A, Ctrl+D, Ctrl+/)
- **User Authentication** - Secure JWT-based authentication system

### 🤖 **AI Enhancement**
- **Google Gemini Integration** - Powered by advanced AI models
- **Intelligent Analysis** - Detects prompt weaknesses and suggests improvements
- **Context Preservation** - Maintains original intent while enhancing clarity
- **Multi-language Support** - Works with prompts in various languages

### 📊 **Analytics & Insights**
- **Usage Tracking** - Monitor prompt enhancement frequency
- **Success Metrics** - Track improvement effectiveness
- **Favorites System** - Save up to 10 favorite prompts per user
- **Historical Data** - View past enhancements and patterns

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Chrome         │    │  React          │    │  Flask          │
│  Extension      │◄──►│  Frontend       │◄──►│  Backend        │
│                 │    │                 │    │                 │
│ • Content Script│    │ • Dashboard     │    │ • JWT Auth      │
│ • Background    │    │ • Analytics     │    │ • AI Enhancement│
│ • Popup UI      │    │ • Prompt Library│    │ • Database      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                                               ┌─────────────────┐
                                               │  Database       │
                                               │                 │
                                               │ • Users         │
                                               │ • Prompts       │
                                               │ • Analytics     │
                                               └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.11+**
- **Node.js 18+**
- **Chrome Browser**
- **Google Gemini API Key**

### 1. Clone Repository

```bash
git clone https://github.com/defescooler/prompt-copilot.git
cd prompt-copilot
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Start backend server
python src/main.py
```

Backend will run on `http://localhost:8002`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev --host
# or
pnpm run dev --host
```

Frontend will run on `http://localhost:5173`

### 4. Chrome Extension Setup

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (top right toggle)
3. Click **Load unpacked**
4. Select the `chrome-extension/` folder
5. Extension will appear in your Chrome toolbar

## 📖 Usage Guide

### Getting Started

1. **Register Account**
   - Open the web dashboard at `http://localhost:5173`
   - Create a new account with username, email, and password
   - Login to access the full dashboard

2. **Install Chrome Extension**
   - Load the extension in Chrome (see setup above)
   - Click the extension icon to login with your account

3. **Enhance Prompts**
   - Go to any AI platform (ChatGPT, Claude, etc.)
   - Start typing a prompt (10+ words)
   - Click the "✨ Enhance" button that appears
   - Review and apply the enhanced version

### Web Dashboard Features

#### 📊 **Analytics Dashboard**
- View total prompts enhanced
- Track time saved and success rates
- Monitor usage patterns and trends

#### 📚 **Prompt Library**
- Browse all your enhanced prompts
- Save favorites (up to 10 per user)
- Search and filter by date or content

#### ⚙️ **Settings**
- Update profile information
- Manage API preferences
- Configure enhancement settings

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+A` | Select all text in textarea |
| `Ctrl+D` | Duplicate current line |
| `Ctrl+/` | Toggle comment (add/remove #) |
| `Ctrl+L` | Clear all text |
| `Ctrl+Shift+D` | Delete current line |

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Required
SECRET_KEY=your-secret-key-here
GEMINI_API_KEY=your-gemini-api-key

# Database (SQLite for development)
DATABASE_URL=sqlite:///app.db

# Optional - Flask settings
FLASK_ENV=development
FLASK_DEBUG=True

# Optional - OAuth (future feature)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Getting Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file as `GEMINI_API_KEY`

## 🚀 Deployment

### Production Deployment

1. **Backend (Flask)**
   ```bash
   # Install production dependencies
   pip install gunicorn
   
   # Run with Gunicorn
   gunicorn -w 4 -b 0.0.0.0:8002 src.main:app
   ```

2. **Frontend (React)**
   ```bash
   # Build for production
   npm run build
   
   # Serve with nginx or any static file server
   ```

3. **Database**
   - For production, use PostgreSQL instead of SQLite
   - Update `DATABASE_URL` in `.env`

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/register`
Register a new user account.

```json
{
  "username": "string",
  "email": "string", 
  "password": "string"
}
```

#### POST `/api/login`
Login and receive JWT token.

```json
{
  "username": "string",
  "password": "string"
}
```

### Prompt Enhancement

#### POST `/api/enhance-prompt`
Enhance a prompt using AI.

```json
{
  "prompt": "string",
  "context": "optional string"
}
```

#### GET `/api/prompts`
Get user's prompt history.

#### POST `/api/prompts/favorite`
Add prompt to favorites.

### Analytics

#### GET `/api/analytics`
Get user analytics and usage statistics.

## 🛠️ Development

### Project Structure

```
prompt-copilot/
├── backend/                 # Flask API server
│   ├── src/
│   │   ├── main.py         # Main Flask application
│   │   ├── models/         # Database models
│   │   └── routes/         # API route handlers
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Environment variables
├── frontend/               # React web application
│   ├── src/
│   │   ├── App.jsx        # Main React component
│   │   ├── App.css        # Styling and UI
│   │   └── main.jsx       # React entry point
│   ├── package.json       # Node.js dependencies
│   └── vite.config.js     # Vite configuration
├── chrome-extension/       # Browser extension
│   ├── manifest.json      # Extension configuration
│   ├── background.js      # Service worker
│   ├── content.js         # Page interaction script
│   ├── popup.html         # Extension popup UI
│   └── popup.js           # Popup functionality
└── README.md              # This file
```

### Tech Stack

#### Backend
- **Flask** - Web framework
- **SQLAlchemy** - Database ORM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Google Generative AI** - Prompt enhancement
- **Flask-CORS** - Cross-origin requests

#### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

#### Chrome Extension
- **Manifest V3** - Latest extension format
- **Vanilla JavaScript** - No frameworks
- **Chrome APIs** - Browser integration

#### Database
- **SQLite** - Development database
- **PostgreSQL** - Production database (recommended)

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Running Tests

```bash
# Backend tests
cd backend
python -m pytest

# Frontend tests  
cd frontend
npm test
```

## 🐛 Troubleshooting

### Common Issues

#### Backend won't start
- Check if port 8002 is available
- Verify Python virtual environment is activated
- Ensure all dependencies are installed
- Check `.env` file configuration

#### Frontend can't connect to backend
- Verify backend is running on port 8002
- Check CORS configuration in Flask app
- Ensure API_BASE_URL is correct in frontend

#### Chrome extension not working
- Check if extension is loaded and enabled
- Verify manifest.json permissions
- Check browser console for errors
- Ensure backend is running for API calls

#### Database errors
- Create database directory: `mkdir -p backend/database`
- Check database permissions
- Verify DATABASE_URL in `.env`

### Getting Help

- 📧 **Email**: [arsen.kozhabekof@gmail.com]
- 🐛 **Issues**: [GitHub Issues](https://github.com/defescooler/prompt-copilot/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/defescooler/prompt-copilot/discussions)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful prompt enhancement
- **React** and **Flask** communities for excellent frameworks
- **Chrome Extensions** documentation and examples
- **Tailwind CSS** for beautiful, responsive styling

## 🔮 Roadmap

- [ ] **Multi-language Support** - Support for non-English prompts
- [ ] **Team Collaboration** - Share prompts and analytics with team members
- [ ] **Advanced Analytics** - More detailed usage insights and trends
- [ ] **Custom AI Models** - Support for other AI providers (OpenAI, Anthropic)
- [ ] **Mobile App** - Native mobile application
- [ ] **API Rate Limiting** - Enterprise-grade API management
- [ ] **Prompt Templates** - Pre-built templates for common use cases
- [ ] **Export/Import** - Backup and restore prompt libraries

---

**Made with ❤️ by [defescooler](https://github.com/defescooler)**

⭐ **Star this repo if you find it useful!**

