# Prompto

AI-powered prompt enhancement system that helps you write better prompts for ChatGPT, Claude, and other AI platforms.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![React](https://img.shields.io/badge/react-19.1-blue.svg)](https://reactjs.org/)

## What is Prompto?

Prompto is a complete system that helps you write better AI prompts. It consists of:

- **Chrome Extension**: Automatically enhances your prompts while you type on AI platforms
- **Web Dashboard**: Manage your prompts, view analytics, and access your prompt library
- **Backend API**: Handles prompt enhancement using Google's Gemini AI

## Why I Built This

Writing effective prompts for AI platforms can be challenging. Many users struggle with:
- Unclear or ineffective prompts
- No way to improve prompts across different AI platforms
- Lack of insights into what makes a good prompt

Prompto solves these problems by providing real-time enhancement and analytics.

## Features

### Chrome Extension
- Works on ChatGPT, Claude, Gemini, and other AI platforms
- One-click prompt enhancement
- Syncs with your web dashboard

### Web Dashboard
- Modern, responsive interface
- Analytics and usage insights
- Prompt library with favorites
- User authentication

### AI Enhancement
- Powered by Google Gemini
- Effectiveness scoring
- Context preservation
- Multi-language support

## Installation

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Chrome Browser
- Google Gemini API Key

### Quick Start with Docker

```bash
# Clone the repository
git clone https://github.com/defescooler/prompt-copilot.git
cd prompt-copilot

# Copy environment template
cp backend/env.example backend/.env

# Add your GEMINI_API_KEY to backend/.env
nano backend/.env

# Start all services
docker compose up -d
```

Services will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Manual Installation

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp env.example .env
# Add GEMINI_API_KEY to .env
alembic upgrade head
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Chrome Extension
1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `chrome-extension/` folder

## How to Use

### Getting Started
1. Register an account at http://localhost:5173
2. Install the Chrome extension
3. Go to any AI platform (ChatGPT, Claude, etc.)
4. Start typing a prompt (10+ words)
5. Click the "Enhance" button to improve your prompt

### Dashboard
- View your prompt enhancement statistics
- Browse and manage your enhanced prompts
- Save favorite prompts
- Update your profile and preferences

## API Documentation

FastAPI automatically generates interactive documentation at `/docs` and `/redoc`.

### Example API Calls

```bash
# Register
POST /api/auth/register
{
  "username": "string",
  "email": "string",
  "password": "string"
}

# Enhance prompt
POST /api/prompts/enhance
{
  "prompt": "string",
  "context": "optional string"
}
```

## Tech Stack

- **Backend**: FastAPI, SQLAlchemy, PostgreSQL
- **Frontend**: React 19, Vite, Tailwind CSS
- **Chrome Extension**: Manifest V3, Vanilla JavaScript
- **AI**: Google Gemini API

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Google Gemini AI for prompt enhancement
- FastAPI and React communities
- Chrome Extensions documentation

---

Made with ❤️ by [defescooler](https://github.com/defescooler)

