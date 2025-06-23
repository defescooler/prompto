# 🤖 AI Enhancement Setup Guide

Prompto now supports multiple AI providers for prompt enhancement! This guide will help you set up GPT (OpenAI) and/or Google Gemini for the "Transform your ideas instantly" feature.

## 🎯 Supported AI Providers

1. **OpenAI GPT-4** - Premium prompt engineering with advanced techniques
2. **Google Gemini** - High-quality enhancement with creative approaches  
3. **Smart Fallback** - Structured enhancement when APIs are unavailable

## ⚡ Quick Setup

### 1. Environment Variables

Create or update your `backend/.env` file:

```bash
# AI Configuration
OPENAI_API_KEY=sk-your-openai-key-here
GEMINI_API_KEY=your-gemini-api-key-here

# AI Provider Selection (auto, openai, gemini)
AI_PROVIDER=auto
```

### 2. API Keys

#### OpenAI API Key (Recommended)
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add credits to your account ($5-20 recommended)
4. Copy the key to `OPENAI_API_KEY` in your `.env` file

#### Google Gemini API Key (Alternative)
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to `GEMINI_API_KEY` in your `.env` file

### 3. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

## 🧠 How It Works

### AI Provider Selection
- **auto** - Tries OpenAI first, falls back to Gemini, then smart fallback
- **openai** - Uses only GPT-4 for enhancement
- **gemini** - Uses only Google Gemini for enhancement

### Enhancement Process
1. User enters a basic prompt
2. AI analyzes the prompt structure and intent
3. Advanced prompt engineering techniques are applied:
   - Role-based prompting
   - Context and constraints
   - Chain-of-thought reasoning
   - Output specifications
   - Quality controls
4. Enhanced prompt is returned with quality metrics

### Quality Metrics
- **Enhancement Ratio** - How much the prompt was expanded/improved
- **Effectiveness Score** - Predicted quality improvement (70-95%)
- **Character Count** - Original vs enhanced length
- **Provider Used** - Which AI service processed the request

## 🚀 Features

### Real-time Enhancement
- **Transform with AI** button provides instant enhancement
- Visual feedback during processing
- Detailed quality metrics
- Copy enhanced prompts with one click

### Smart Analytics
- Track enhancement effectiveness
- Monitor usage patterns
- Calculate time saved
- Performance insights

### Multi-Mode Enhancement
- **LLM Mode** - Comprehensive prompt enhancement for better AI responses
- **Compression Mode** - Reduce token usage while maintaining effectiveness

## 🔧 Advanced Configuration

### Custom AI Provider Order
```bash
# Try OpenAI first, then Gemini
AI_PROVIDER=auto

# Use only OpenAI GPT-4
AI_PROVIDER=openai

# Use only Google Gemini
AI_PROVIDER=gemini
```

### Performance Tuning
The system automatically optimizes for:
- Response quality
- Processing speed
- Cost efficiency
- Fallback reliability

## 🎨 Frontend Integration

The enhanced dashboard shows:
- AI provider used (🧠 GPT-4, 🤖 Gemini, ⚡ Smart)
- Quality score percentage
- Enhancement ratio
- Processing time
- Character optimization

## 🛡️ Error Handling

The system gracefully handles:
- API rate limits
- Network timeouts
- Invalid API keys
- Service unavailability
- Malformed prompts

## 💡 Best Practices

### For OpenAI GPT-4
- Ideal for complex, professional prompts
- Excellent for business and technical content
- Higher cost but superior quality

### For Google Gemini
- Great for creative and diverse prompts
- Good balance of quality and cost
- Strong multilingual support

### Prompt Guidelines
- Keep original prompts clear and concise
- Specify your intended use case
- Include context when relevant
- Review enhanced prompts before use

## 📊 Monitoring Usage

Track your AI enhancement usage:
- Total prompts enhanced
- Average quality improvement
- Time saved through automation
- Favorite prompt patterns

## 🔍 Troubleshooting

### Common Issues

1. **"Enhancement service temporarily unavailable"**
   - Check API keys are valid
   - Verify internet connection
   - Check API service status

2. **Low quality scores**
   - Original prompt may be too short
   - Try providing more context
   - Consider the use case specificity

3. **Slow responses**
   - Check API rate limits
   - Consider switching providers
   - Monitor network latency

### Debug Mode
Set `FLASK_ENV=development` for detailed error logs.

## 🎯 Next Steps

1. Set up your preferred AI provider
2. Test with a few sample prompts
3. Explore different enhancement modes
4. Build your prompt library
5. Share enhanced prompts with your team

---

**🚀 Ready to transform your prompts? The AI Enhancement Studio awaits!** 