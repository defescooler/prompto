# 🚀 Prompto - AI Prompt Enhancer

Beautiful Chrome extension that enhances your AI prompts with intelligent suggestions, featuring a modern Dribbble-style UI and Cursor-like user experience.

## ✨ Features

### 🎨 **Beautiful UI Design**
- **Dribbble-inspired interface** with smooth animations
- **Gradient buttons** and glass morphism effects
- **Floating menu** with backdrop blur
- **Cursor-style suggestions** for seamless workflow
- **Dark mode support** and responsive design

### 🤖 **AI-Powered Enhancement**
- **Prompt Enhancement** - Improve clarity and effectiveness
- **Token Optimization** - Reduce token usage while preserving meaning
- **Real-time suggestions** with accept/decline interface
- **Usage analytics** and performance tracking

### 🎯 **Smart Integration**
- **Auto-detection** of AI platforms (ChatGPT, Claude, Gemini, etc.)
- **Seamless positioning** within existing UI
- **Keyboard shortcuts** for power users
- **Non-intrusive design** that doesn't break websites

## 🚀 Quick Start

### Installation

1. **Download** the extension files
2. **Open Chrome** and go to `chrome://extensions/`
3. **Enable Developer mode** (toggle in top right)
4. **Click "Load unpacked"** and select the extension folder
5. **Visit ChatGPT** or any supported AI platform

### Usage

1. **Type a prompt** (5+ characters) in any AI chat
2. **Click the P button** that appears near the input field
3. **Choose "Enhance Prompt"** from the beautiful floating menu
4. **Review the suggestion** in the Cursor-style overlay
5. **Accept or decline** the enhancement

## 🛠️ Setup for Development

### Prerequisites

- Chrome browser
- Backend server running on `localhost:8002`
- Node.js (optional, for development)

### Backend Setup

```bash
# Start the Prompto backend server
cd /path/to/prompto-backend
python src/main.py
```

The extension expects the backend to be running on `http://localhost:8002` with the following endpoints:

- `POST /api/enhance-prompt` - Enhance a prompt
- `POST /api/optimize-prompt` - Optimize token usage
- `GET /api/user` - Get user data
- `POST /api/sync-stats` - Sync usage statistics

### Extension Development

```bash
# Install dependencies (if using build tools)
npm install

# Build for production
npm run build

# Watch for changes
npm run dev
```

## 📁 File Structure

```
prompto-extension/
├── manifest.json          # Extension configuration
├── content.js             # Main content script
├── content.css            # Beautiful Dribbble-style CSS
├── background.js          # Service worker
├── popup.html             # Extension popup interface
├── icon16.png             # Extension icons
├── icon48.png
├── icon128.png
└── README.md              # This file
```

## 🎨 Design Features

### Main Button
- **Gradient background** with hover animations
- **Custom icon** with your branding
- **Smooth transitions** and micro-interactions
- **Perfect positioning** relative to AI platform UI

### Floating Menu
- **Glass morphism** with backdrop blur
- **Smooth scale animations** with cubic-bezier easing
- **Two action buttons** with distinct styling
- **Responsive design** for mobile and desktop

### Enhancement Panel
- **Side-by-side comparison** of original vs enhanced
- **Usage statistics** with improvement metrics
- **Accept/Decline buttons** with keyboard shortcuts
- **Cursor-style interface** for seamless workflow

## 🔧 Configuration

### API Endpoints

The extension can be configured to use different backend URLs by modifying the `API_BASE_URL` in `background.js`:

```javascript
const API_BASE_URL = 'http://localhost:8002'; // Change this
```

### Supported Platforms

Currently supports:
- ChatGPT (chat.openai.com, chatgpt.com)
- Claude (claude.ai)
- Google Gemini (gemini.google.com)
- Perplexity (perplexity.ai)
- Poe (poe.com)
- You.com (you.com)

Add more platforms by updating the `host_permissions` in `manifest.json`.

## 📊 Analytics

The extension tracks:
- **Total enhancements** performed
- **Time saved** (estimated)
- **Tokens saved** through optimization
- **Characters processed**
- **Usage patterns** and performance metrics

Data is stored locally and optionally synced with the backend every 30 minutes.

## ⌨️ Keyboard Shortcuts

- **Ctrl/Cmd + Enter** - Accept enhancement
- **Escape** - Close floating menu or panel
- **Tab** - Navigate between buttons
- **Enter/Space** - Activate focused button

## 🎯 Browser Compatibility

- **Chrome** 88+ (Manifest V3 support)
- **Edge** 88+ (Chromium-based)
- **Brave** (Chromium-based)
- **Opera** (Chromium-based)

## 🔒 Privacy & Security

- **Local storage** for user preferences and stats
- **No data collection** without explicit consent
- **Secure API communication** with backend
- **Minimal permissions** required
- **No tracking** or analytics without user approval

## 🐛 Troubleshooting

### Common Issues

**Button not appearing:**
- Check if you're on a supported AI platform
- Ensure you've typed at least 5 characters
- Refresh the page and try again

**API errors:**
- Verify backend is running on `localhost:8002`
- Check browser console for detailed error messages
- Ensure CORS is properly configured on backend

**Styling conflicts:**
- Extension uses isolated CSS with `!important` rules
- Report any visual conflicts as issues

### Debug Mode

Enable debug logging by opening browser console (F12) and looking for messages starting with `🚀 Prompto:`.

## 🚀 Deployment

### Chrome Web Store

1. **Build** the extension for production
2. **Test** thoroughly on multiple platforms
3. **Create** Chrome Web Store developer account
4. **Upload** the extension package
5. **Submit** for review

### Enterprise Deployment

For enterprise deployment, use Chrome's managed policies to distribute the extension automatically.

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **nFactorial Incubator** for support and guidance
- **Dribbble community** for design inspiration
- **Cursor IDE** for UX inspiration
- **Chrome Extensions team** for excellent documentation

## 📞 Support

- **GitHub Issues** - Bug reports and feature requests
- **Email** - support@prompto.ai
- **Discord** - Join our community server

---

**Made with ❤️ for the nFactorial Incubator program**

