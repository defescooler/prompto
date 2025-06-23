// Prompto Background Service Worker - SIMPLE WORKING VERSION
// Based on Alejandro AO tutorial approach

console.log('🚀 Prompto: Background script loaded');

const API_BASE_URL = 'http://localhost:8002';

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('🚀 Prompto: Background received:', request.action);
  
  if (request.action === 'enhancePrompt') {
    enhancePrompt(request.prompt)
      .then(sendResponse)
      .catch(error => sendResponse({ 
        success: false, 
        error: error.message 
      }));
    return true;
  }
});

async function enhancePrompt(prompt) {
  if (!prompt?.trim()) {
    throw new Error('Prompt is required');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/prompts/enhance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ 
        prompt: prompt.trim(),
        method: 'llm' // Use GPT-4 style enhancement
      })
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    if (!data.enhanced_prompt && !data.result) {
      throw new Error('No enhanced prompt received from server');
    }

    return {
      success: true,
      original: prompt,
      enhanced: data.enhanced_prompt || data.result,
      banner: 'success'
    };

  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Backend not running on localhost:8002 - Please start the backend server');
    }
    throw error;
  }
}

