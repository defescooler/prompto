// Prompto Background Service Worker - BULLETPROOF VERSION
// Enhanced with comprehensive error handling and defensive programming
// State-of-the-art prompt engineering techniques support

console.log('🚀 Prompto: Background script loaded');

const API_BASE_URL = 'http://localhost:8002';

// Default techniques configuration - loaded from storage
let activeTechniques = {
  zero_shot_cot: true,
  role_prompting: true,
  xml_schema: true,
  negative_prompts: true,
  compression: false,
  triple_prime: true
};
a
// Load user's technique preferences from storage
chrome.storage.sync.get(['promptoTechniques'], (result) => {
  if (result.promptoTechniques && typeof result.promptoTechniques === 'object') {
    activeTechniques = { ...activeTechniques, ...result.promptoTechniques };
    console.log('🚀 Prompto: Loaded technique preferences:', Object.keys(activeTechniques).filter(k => activeTechniques[k]));
  }
});

// Listen for technique preference changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.promptoTechniques) {
    activeTechniques = { ...activeTechniques, ...changes.promptoTechniques.newValue };
    console.log('🚀 Prompto: Updated technique preferences:', Object.keys(activeTechniques).filter(k => activeTechniques[k]));
  }
});

// Enhanced error handling wrapper
const safeExecute = (fn, context = 'Unknown') => {
  try {
    return fn();
  } catch (error) {
    console.error(`🚀 Prompto Background: Error in ${context}:`, error);
    return null;
  }
};

// Validate input parameters
const validateEnhanceRequest = (prompt) => {
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Prompt must be a non-empty string');
  }
  
  const trimmed = prompt.trim();
  if (trimmed.length < 5) {
    throw new Error('Prompt must be at least 5 characters long');
  }
  
  if (trimmed.length > 5000) {
    throw new Error('Prompt too long (max 5000 characters)');
  }
  
  return trimmed;
};

// Enhanced message handler with comprehensive error handling
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  return safeExecute(() => {
    console.log('🚀 Prompto: Background received:', request?.action, 'prompt length:', request?.prompt?.length);
    
    // Validate request structure
    if (!request || typeof request !== 'object') {
      console.error('🚀 Prompto: Invalid request structure');
      sendResponse({ success: false, error: 'Invalid request format' });
      return false;
    }
    
    if (request.action === 'enhancePrompt') {
      enhancePrompt(request.prompt, request.preset, request.techniques)
        .then(response => {
          console.log('🚀 Prompto: Background sending response:', response);
          if (typeof sendResponse === 'function') {
            sendResponse(response);
          }
        })
        .catch(error => {
          console.error('🚀 Prompto: Background error:', error);
          if (typeof sendResponse === 'function') {
            sendResponse({ 
              success: false, 
              error: error?.message || 'Unknown error occurred'
            });
          }
        });
      return true; // Keep message channel open for async response
    }
    
    if (request.action === 'openOptions') {
      try {
        chrome.runtime.openOptionsPage();
        sendResponse({ success: true });
      } catch (error) {
        console.error('🚀 Prompto: Error opening options page:', error);
        sendResponse({ success: false, error: error.message });
      }
      return false;
    }
    
    if (request.type === 'PROMPTO_ENHANCE') {
      fetch('http://localhost:8000/api/prompts/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: request.prompt })
      })
        .then(res => res.json())
        .then(data => sendResponse({ success: true, data }))
        .catch(() => sendResponse({ success: false }));
      return true; // Keep the message channel open for async response
    }
    
    // Unknown action
    console.warn('🚀 Prompto: Unknown action:', request.action);
    sendResponse({ success: false, error: 'Unknown action' });
    return false;
  }, 'messageHandler') !== null;
});

async function enhancePrompt(prompt, preset = null, customTechniques = null) {
  const startTime = Date.now();
  
  try {
    // Validate input
    const validatedPrompt = validateEnhanceRequest(prompt);
    
    // Determine which techniques to use
    let selectedTechniques = Object.keys(activeTechniques).filter(k => activeTechniques[k]);
    
    // Override with custom techniques if provided
    if (customTechniques && Array.isArray(customTechniques)) {
      selectedTechniques = customTechniques;
    }
    
    // Prepare enhanced request payload
    const requestPayload = { 
      prompt: validatedPrompt,
      method: 'llm',
      techniques: selectedTechniques
    };
    
    // Add preset if specified
    if (preset && typeof preset === 'string') {
      requestPayload.preset = preset;
    }
    
    console.log('🚀 Prompto: Using techniques:', selectedTechniques);
    
    // Prepare request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/prompts/enhance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestPayload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Check response status
      if (!response.ok) {
        let errorText;
        try {
          errorText = await response.text();
        } catch (e) {
          errorText = response.statusText || `HTTP ${response.status}`;
        }
        
        if (response.status === 0 || response.status >= 500) {
          throw new Error('Backend server is not responding');
        } else if (response.status === 404) {
          throw new Error('Enhancement endpoint not found');
        } else if (response.status === 429) {
          throw new Error('Too many requests - please wait');
        } else {
          throw new Error(`Server error: ${errorText}`);
        }
      }

      // Parse response safely
      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error('Invalid response format from server');
      }

      const clientTime = Date.now() - startTime;

      // Validate response structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response structure');
      }

      if (!data.enhanced_prompt && !data.result) {
        throw new Error('No enhanced prompt in response');
      }

      const enhanced = data.enhanced_prompt || data.result;
      if (typeof enhanced !== 'string' || enhanced.trim().length === 0) {
        throw new Error('Enhanced prompt is empty or invalid');
      }

      // Build success response with speed info and technique details
      const techniqueCount = data.techniques_applied || selectedTechniques.length;
      const speedInfo = data.cached ? 
        `⚡ INSTANT (cached, ${techniqueCount} techniques)` : 
        `🚀 ${data.response_time_ms || clientTime}ms via ${data.provider_used || 'AI'} (${techniqueCount} techniques)`;

      return {
        success: true,
        original: validatedPrompt,
        enhanced: enhanced.trim(),
        strategy: speedInfo,
        cached: Boolean(data.cached),
        responseTime: data.response_time_ms || clientTime,
        provider: data.provider_used || 'unknown',
        techniquesUsed: data.techniques_used || selectedTechniques,
        techniquesApplied: techniqueCount,
        enhancementRatio: data.enhancement_ratio || null,
        effectivenessScore: data.effectiveness_score || null
      };

    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        throw new Error('Request timed out - please try again');
      }
      
      if (fetchError.name === 'TypeError' && fetchError.message.includes('fetch')) {
        throw new Error('Backend not running on localhost:8002 - Please start the backend server');
      }
      
      throw fetchError;
    }

  } catch (error) {
    console.error('🚀 Prompto: Enhancement error:', error);
    
    // Sanitize error message for user display
    let userMessage = error?.message || 'Unknown error occurred';
    
    // Don't expose internal errors to users
    if (userMessage.includes('fetch') || userMessage.includes('network')) {
      userMessage = 'Network connection error - check if backend is running';
    }
    
    throw new Error(userMessage);
  }
}

