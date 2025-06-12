// Content script for Prompt Copilot Chrome Extension
let isInitialized = false;
let currentTextarea = null;
let enhanceButton = null;
let enhancementPanel = null;
let userToken = null;
let userData = null;

// Initialize the extension
function initializeExtension() {
  if (isInitialized) return;
  
  console.log('Initializing Prompt Copilot on', window.location.hostname);
  
  // Load user data
  loadUserData();
  
  // Start monitoring for textareas
  startTextareaMonitoring();
  
  // Add styles
  addCustomStyles();
  
  isInitialized = true;
}

// Load user data from storage
async function loadUserData() {
  try {
    const result = await chrome.storage.local.get(['userToken']);
    if (result.userToken) {
      userToken = result.userToken;
      
      // Get user data from backend
      chrome.runtime.sendMessage({
        action: 'getUserData',
        token: userToken
      }, (response) => {
        if (response && response.user) {
          userData = response.user;
          console.log('User data loaded:', userData.username);
        }
      });
    }
  } catch (error) {
    console.error('Error loading user data:', error);
  }
}

// Monitor for textareas on AI platforms
function startTextareaMonitoring() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          checkForTextareas(node);
        }
      });
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Check existing textareas
  checkForTextareas(document.body);
}

// Check for textareas and add enhancement functionality
function checkForTextareas(element) {
  const textareas = element.querySelectorAll('textarea, [contenteditable="true"]');
  
  textareas.forEach((textarea) => {
    if (!textarea.dataset.promptCopilotEnabled) {
      setupTextareaEnhancement(textarea);
      textarea.dataset.promptCopilotEnabled = 'true';
    }
  });
}

// Setup enhancement for a specific textarea
function setupTextareaEnhancement(textarea) {
  let debounceTimer;
  
  const handleInput = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const text = textarea.value || textarea.textContent || '';
      
      if (text.trim().length >= 10) {
        showEnhanceButton(textarea);
      } else {
        hideEnhanceButton();
      }
    }, 500);
  };
  
  textarea.addEventListener('input', handleInput);
  textarea.addEventListener('focus', handleInput);
  textarea.addEventListener('blur', () => {
    setTimeout(hideEnhanceButton, 200);
  });
}



// Show enhance button
function showEnhanceButton(textarea) {
  if (enhanceButton) {
    hideEnhanceButton();
  }
  
  currentTextarea = textarea;
  
  enhanceButton = document.createElement('button');
  enhanceButton.innerHTML = '✨ Enhance';
  enhanceButton.className = 'prompt-copilot-enhance-btn';
  enhanceButton.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    enhanceCurrentPrompt();
  };
  
  // Position the button
  const rect = textarea.getBoundingClientRect();
  enhanceButton.style.position = 'fixed';
  enhanceButton.style.top = (rect.bottom - 40) + 'px';
  enhanceButton.style.right = (window.innerWidth - rect.right + 10) + 'px';
  enhanceButton.style.zIndex = '10000';
  
  document.body.appendChild(enhanceButton);
}

// Hide enhance button
function hideEnhanceButton() {
  if (enhanceButton) {
    enhanceButton.remove();
    enhanceButton = null;
  }
}

// Enhance current prompt
async function enhanceCurrentPrompt() {
  if (!currentTextarea) return;
  
  const originalText = currentTextarea.value || currentTextarea.textContent || '';
  
  if (originalText.trim().length < 10) {
    showNotification('Please enter at least 10 characters to enhance', 'warning');
    return;
  }
  
  // Show loading state
  enhanceButton.innerHTML = '⏳ Enhancing...';
  enhanceButton.disabled = true;
  
  try {
    // Send enhancement request
    chrome.runtime.sendMessage({
      action: 'enhancePrompt',
      prompt: originalText,
      userId: userData?.id
    }, (response) => {
      if (response && response.success) {
        showEnhancementPanel(response.original, response.enhanced);
      } else {
        showNotification(response?.error || 'Enhancement failed', 'error');
      }
      
      // Reset button
      enhanceButton.innerHTML = '✨ Enhance';
      enhanceButton.disabled = false;
    });
  } catch (error) {
    console.error('Error enhancing prompt:', error);
    showNotification('Enhancement failed', 'error');
    
    // Reset button
    enhanceButton.innerHTML = '✨ Enhance';
    enhanceButton.disabled = false;
  }
}

// Show enhancement panel
function showEnhancementPanel(original, enhanced) {
  hideEnhancementPanel();
  
  enhancementPanel = document.createElement('div');
  enhancementPanel.className = 'prompt-copilot-panel';
  enhancementPanel.innerHTML = `
    <div class="prompt-copilot-panel-header">
      <h3>✨ Enhanced Prompt</h3>
      <button class="prompt-copilot-close-btn" onclick="this.closest('.prompt-copilot-panel').remove()">×</button>
    </div>
    <div class="prompt-copilot-panel-content">
      <div class="prompt-copilot-section">
        <h4>Original:</h4>
        <div class="prompt-copilot-text original">${original}</div>
      </div>
      <div class="prompt-copilot-section">
        <h4>Enhanced:</h4>
        <div class="prompt-copilot-text enhanced">${enhanced}</div>
      </div>
      <div class="prompt-copilot-actions">
        <button class="prompt-copilot-btn primary" onclick="useEnhancedPrompt('${enhanced.replace(/'/g, "\\'")}')">📋 Use Enhanced</button>
        <button class="prompt-copilot-btn secondary" onclick="savePromptToLibrary('${original.replace(/'/g, "\\'")}', '${enhanced.replace(/'/g, "\\'")}')">💾 Save to Library</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(enhancementPanel);
}

// Hide enhancement panel
function hideEnhancementPanel() {
  if (enhancementPanel) {
    enhancementPanel.remove();
    enhancementPanel = null;
  }
}

// Use enhanced prompt
function useEnhancedPrompt(enhancedText) {
  if (currentTextarea) {
    if (currentTextarea.value !== undefined) {
      currentTextarea.value = enhancedText;
    } else {
      currentTextarea.textContent = enhancedText;
    }
    
    // Trigger input event
    currentTextarea.dispatchEvent(new Event('input', { bubbles: true }));
    currentTextarea.focus();
  }
  
  hideEnhancementPanel();
  hideEnhanceButton();
  showNotification('Enhanced prompt applied!', 'success');
}

// Save prompt to library
function savePromptToLibrary(original, enhanced) {
  if (!userToken) {
    showNotification('Please log in to save prompts', 'warning');
    return;
  }
  
  const title = original.substring(0, 50) + (original.length > 50 ? '...' : '');
  
  chrome.runtime.sendMessage({
    action: 'savePrompt',
    promptData: {
      title: title,
      body: original,
      enhanced_text: enhanced,
      category: 'general'
    },
    token: userToken
  }, (response) => {
    if (response && !response.error) {
      showNotification('Prompt saved to library!', 'success');
    } else {
      showNotification(response?.error || 'Failed to save prompt', 'error');
    }
  });
}

// Show notification
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `prompt-copilot-notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add custom styles
function addCustomStyles() {
  if (document.getElementById('prompt-copilot-styles')) return;
  
  const styles = document.createElement('style');
  styles.id = 'prompt-copilot-styles';
  styles.textContent = `
    .prompt-copilot-enhance-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 2px 10px rgba(102, 126, 234, 0.3);
      transition: all 0.2s ease;
      z-index: 10000;
    }
    
    .prompt-copilot-enhance-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }
    
    .prompt-copilot-enhance-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    .prompt-copilot-panel {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      z-index: 10001;
      max-width: 600px;
      width: 90vw;
      max-height: 80vh;
      overflow-y: auto;
    }
    
    .prompt-copilot-panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #e5e7eb;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 12px 12px 0 0;
    }
    
    .prompt-copilot-panel-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }
    
    .prompt-copilot-close-btn {
      background: none;
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background 0.2s ease;
    }
    
    .prompt-copilot-close-btn:hover {
      background: rgba(255, 255, 255, 0.2);
    }
    
    .prompt-copilot-panel-content {
      padding: 20px;
    }
    
    .prompt-copilot-section {
      margin-bottom: 20px;
    }
    
    .prompt-copilot-section h4 {
      margin: 0 0 8px 0;
      font-size: 14px;
      font-weight: 600;
      color: #374151;
    }
    
    .prompt-copilot-text {
      padding: 12px;
      border-radius: 8px;
      font-size: 14px;
      line-height: 1.5;
    }
    
    .prompt-copilot-text.original {
      background: #fef3c7;
      border: 1px solid #f59e0b;
      color: #92400e;
    }
    
    .prompt-copilot-text.enhanced {
      background: #d1fae5;
      border: 1px solid #10b981;
      color: #065f46;
    }
    
    .prompt-copilot-actions {
      display: flex;
      gap: 12px;
      margin-top: 20px;
    }
    
    .prompt-copilot-btn {
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.2s ease;
    }
    
    .prompt-copilot-btn.primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    
    .prompt-copilot-btn.primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }
    
    .prompt-copilot-btn.secondary {
      background: #f3f4f6;
      color: #374151;
      border: 1px solid #d1d5db;
    }
    
    .prompt-copilot-btn.secondary:hover {
      background: #e5e7eb;
    }
    
    .prompt-copilot-notification {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      z-index: 10002;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    }
    
    .prompt-copilot-notification.show {
      transform: translateX(0);
    }
    
    .prompt-copilot-notification.success {
      background: #10b981;
      color: white;
    }
    
    .prompt-copilot-notification.error {
      background: #ef4444;
      color: white;
    }
    
    .prompt-copilot-notification.warning {
      background: #f59e0b;
      color: white;
    }
    
    .prompt-copilot-notification.info {
      background: #3b82f6;
      color: white;
    }
  `;
  
  document.head.appendChild(styles);
}

// Handle messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'enhanceSelection') {
    // Handle context menu enhancement
    enhanceSelectedText(request.text);
  }
});

// Enhance selected text
function enhanceSelectedText(text) {
  chrome.runtime.sendMessage({
    action: 'enhancePrompt',
    prompt: text,
    userId: userData?.id
  }, (response) => {
    if (response && response.success) {
      showEnhancementPanel(response.original, response.enhanced);
    } else {
      showNotification(response?.error || 'Enhancement failed', 'error');
    }
  });
}

// Make functions globally available
window.useEnhancedPrompt = useEnhancedPrompt;
window.savePromptToLibrary = savePromptToLibrary;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeExtension);
} else {
  initializeExtension();
}

// Add keyboard shortcuts for text selection
function addKeyboardShortcuts(textarea) {
  textarea.addEventListener('keydown', (e) => {
    // Ctrl+A or Cmd+A (for Mac) - Select all text
    if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
      e.preventDefault();
      e.stopPropagation();
      
      // Select all text in the textarea
      if (textarea.tagName === 'TEXTAREA' || textarea.type === 'text') {
        // For regular textareas and input fields
        textarea.select();
        textarea.setSelectionRange(0, textarea.value.length);
      } else if (textarea.contentEditable === 'true') {
        // For contenteditable divs (like ChatGPT)
        const range = document.createRange();
        range.selectNodeContents(textarea);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      }
      
      console.log('Selected all text in textarea');
    }
    
    // Optional: Ctrl+D - Duplicate current line
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
      e.preventDefault();
      const text = textarea.value || textarea.textContent || '';
      const cursorPos = textarea.selectionStart || 0;
      
      // Find current line
      const lines = text.split('\n');
      let currentLineIndex = 0;
      let charCount = 0;
      
      for (let i = 0; i < lines.length; i++) {
        if (charCount + lines[i].length >= cursorPos) {
          currentLineIndex = i;
          break;
        }
        charCount += lines[i].length + 1; // +1 for newline
      }
      
      const currentLine = lines[currentLineIndex];
      lines.splice(currentLineIndex + 1, 0, currentLine);
      
      if (textarea.tagName === 'TEXTAREA') {
        textarea.value = lines.join('\n');
      } else {
        textarea.textContent = lines.join('\n');
      }
    }
  });
}


