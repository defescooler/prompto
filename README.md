# 🚀 Prompt Copilot

**AI-Powered Prompt Enhancement System with Chrome Extension & Web Dashboard**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/fastapi-0.104.1-green.svg)](https://fastapi.tiangolo.com/)
[![React 19](https://img.shields.io/badge/react-19.1-blue.svg)](https://reactjs.org/)
[![Chrome Extension](https://img.shields.io/badge/chrome-extension-green.svg)](https://developer.chrome.com/docs/extensions/)

> Transform your AI prompts with intelligent enhancement, cross-platform synchronization, and powerful analytics. Complete system with FastAPI backend, PostgreSQL database, and comprehensive API.

## 📋 Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Tech Stack](#tech-stack)
- [Contributing](#contributing)
- [License](#license)

## 📖 Project Description

Prompt Copilot is a comprehensive AI-powered prompt enhancement system that helps users improve their prompts across various AI platforms. The system consists of three main components:

- **Chrome Extension**: Automatically detects typing in AI platforms and provides one-click enhancement
- **Web Dashboard**: Modern React interface for managing prompts, viewing analytics, and accessing the prompt library
- **FastAPI Backend**: High-performance API server with PostgreSQL database and JWT authentication

### What Problem Does It Solve?

- **Inconsistent Prompt Quality**: Users often write unclear or ineffective prompts
- **Manual Enhancement**: No automated way to improve prompts across different AI platforms
- **Lack of Analytics**: No insights into prompt effectiveness and usage patterns
- **Cross-Platform Sync**: Difficulty managing prompts across different AI services

### What Makes It Stand Out?

- **Real-time Enhancement**: Instant AI-powered prompt improvement
- **Cross-Platform Integration**: Works with ChatGPT, Claude, Gemini, and other AI platforms
- **Effectiveness Scoring**: Calculates prompt quality metrics using advanced algorithms
- **Modern Tech Stack**: FastAPI for high performance, React 19 for modern UI, PostgreSQL for reliability

## ✨ Features

### 🔌 Chrome Extension
- Smart detection of AI platform typing
- One-click prompt enhancement
- Real-time synchronization with dashboard
- Cross-platform compatibility (ChatGPT, Claude, Gemini)

### 🌐 Web Dashboard
- Modern, responsive interface with dark theme
- Analytics dashboard with usage insights
- Prompt library with favorites system
- User authentication and profile management

### 🤖 AI Enhancement
- Google Gemini integration for intelligent analysis
- Effectiveness scoring and quality metrics
- Context preservation during enhancement
- Multi-language support

### 📊 Analytics & Insights
- Usage tracking and success metrics
- Effectiveness scoring breakdown
- Historical data and patterns
- Performance analytics

## 🚀 Installation

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

# Edit .env and add your GEMINI_API_KEY
nano backend/.env

# Start all services
docker compose up -d
```

Services will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### Manual Installation

#### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp env.example .env
# Add your GEMINI_API_KEY to .env

# Initialize database
alembic upgrade head

# Start server
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

#### Chrome Extension Setup

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `chrome-extension/` folder

## 📖 Usage

### Getting Started

1. **Register Account**
   - Open http://localhost:5173
   - Create account with username, email, and password
   - Login to access dashboard

2. **Install Chrome Extension**
   - Load extension in Chrome
   - Login with your account credentials

3. **Enhance Prompts**
   - Go to any AI platform (ChatGPT, Claude, etc.)
   - Start typing a prompt (10+ words)
   - Click the "✨ Enhance" button
   - Review and apply enhanced version

### Dashboard Features

- **Analytics**: View prompt enhancement statistics and effectiveness scores
- **Prompt Library**: Browse, search, and manage your enhanced prompts
- **Favorites**: Save up to 10 favorite prompts per user
- **Settings**: Update profile and preferences

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+A` | Select all text |
| `Ctrl+D` | Duplicate line |
| `Ctrl+/` | Toggle comment |
| `Ctrl+L` | Clear text |

## 📚 API Documentation

FastAPI automatically generates interactive API documentation at `/docs` and `/redoc`.

### Authentication

```bash
# Register
POST /api/auth/register
{
  "username": "string",
  "email": "string",
  "password": "string"
}

# Login
POST /api/auth/login
{
  "username": "string",
  "password": "string"
}
```

### Prompt Enhancement

```bash
# Enhance prompt
POST /api/prompts/enhance
{
  "prompt": "string",
  "context": "optional string"
}

# Get user prompts
GET /api/prompts

# Add to favorites
POST /api/prompts/{id}/favorite
```

### Prompt Drafts

```bash
# CRUD operations for drafts
GET /api/drafts
POST /api/drafts
PUT /api/drafts/{id}
DELETE /api/drafts/{id}
```

## 🛠️ Tech Stack

### Backend
- **FastAPI 0.104** - Modern, fast web framework
- **SQLAlchemy 2.0** - Database ORM
- **Alembic** - Database migrations
- **PostgreSQL** - Production database
- **Pydantic** - Data validation
- **Python-Jose** - JWT authentication
- **Passlib** - Password hashing

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Radix UI** - Component primitives
- **Recharts** - Data visualization

### Chrome Extension
- **Manifest V3** - Extension format
- **Vanilla JavaScript** - No frameworks
- **Chrome APIs** - Browser integration

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Orchestration
- **Uvicorn** - ASGI server

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test

# API testing
cd backend
python test_api.py
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for prompt enhancement
- **FastAPI** community for excellent framework
- **React** team for modern UI development
- **Chrome Extensions** documentation

---

**Made with ❤️ by [defescooler](https://github.com/defescooler)**

⭐ **Star this repo if you find it useful!**

