// Prompto Background Script - API Handler
console.log('🚀 Prompto: Background script loaded');

// Backend API configuration
const BACKEND_URL = 'http://localhost:8002';

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('🚀 Prompto: Received message:', request);
  
  if (request.action === 'enhance') {
    handleEnhance(request.prompt)
      .then(response => sendResponse(response))
      .catch(error => {
        console.error('🚀 Prompto: Enhancement error:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Keep message channel open for async response
  }
  
  if (request.action === 'optimize') {
    handleOptimize(request.prompt)
      .then(response => sendResponse(response))
      .catch(error => {
        console.error('🚀 Prompto: Optimization error:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Keep message channel open for async response
  }
});

async function handleEnhance(prompt) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/prompts/enhance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt,
        enhancement_type: 'general'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('🚀 Prompto: Enhancement response:', data);
    
    return {
      success: true,
      enhanced: data.enhanced_prompt || data.suggestion || 'Enhanced prompt not available'
    };
  } catch (error) {
    console.error('🚀 Prompto: Enhancement API error:', error);
    throw new Error(`Enhancement failed: ${error.message}`);
  }
}

async function handleOptimize(prompt) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/prompts/optimize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt,
        optimization_type: 'token_efficiency'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('🚀 Prompto: Optimization response:', data);
    
    return {
      success: true,
      optimized: data.optimized_prompt || data.suggestion || 'Optimized prompt not available'
    };
  } catch (error) {
    console.error('🚀 Prompto: Optimization API error:', error);
    throw new Error(`Optimization failed: ${error.message}`);
  }
}

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('🚀 Prompto: Extension installed:', details.reason);
  
  if (details.reason === 'install') {
    // Open welcome page or show onboarding
    chrome.tabs.create({
      url: 'https://prompto.ai/welcome'
    });
  }
});

// Handle extension startup
chrome.runtime.onStartup.addListener(() => {
  console.log('🚀 Prompto: Extension started');
});
