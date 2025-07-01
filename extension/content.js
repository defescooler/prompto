console.log('🚀 Prompto: Content script loaded');

(() => {
  if (window.__PROMPTO_LOADED) return;
  window.__PROMPTO_LOADED = true;

  // Defensive error handling wrapper
  const safeExecute = (fn, context = 'Unknown') => {
    try {
      return fn();
    } catch (error) {
      console.error(`🚀 Prompto: Error in ${context}:`, error);
      return null;
    }
  };

  // Safe DOM manipulation helpers
  const safeQuerySelector = (selector, root = document) => {
    try {
      return root?.querySelector?.(selector) || null;
    } catch (error) {
      console.error(`🚀 Prompto: Invalid selector "${selector}":`, error);
      return null;
    }
  };

  const safeQuerySelectorAll = (selector, root = document) => {
    try {
      return [...(root?.querySelectorAll?.(selector) || [])];
    } catch (error) {
      console.error(`🚀 Prompto: Invalid selector "${selector}":`, error);
      return [];
    }
  };

  const CLASSES = {
    wrapper: 'prompto-wrapper',
    fab: 'prompto-fab',
    child: 'prompto-child',
    toast: 'prompto-toast',
    banner: 'prompto-banner',
    btn: 'prompto-btn',
    particle: 'prompto-particle',
    overlay: 'prompto-overlay',
    typewriter: 'prompto-typewriter'
  };

  // Enhanced Lucide-style icons with proper styling
  const ICONS = {
    plus: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
    
    sparkles: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path><path d="M5 3v4"></path><path d="M19 17v4"></path><path d="M3 5h4"></path><path d="M17 19h4"></path></svg>`,
    
    settings: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
    
    construction: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20h20"></path><path d="M7 16v4"></path><path d="M17 16v4"></path><path d="M2 8l20 0"></path><path d="M7 8V4"></path><path d="M17 8V4"></path><path d="M7 4C7 2.5 8.5 1 12 1s5 1.5 5 3"></path></svg>`,
    
    check: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20,6 9,17 4,12"></polyline></svg>`,
    
    x: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
    
    spinner: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="prompto-spinner"><path d="M21 12a9 9 0 11-6.219-8.56"></path></svg>`,
    
    zap: `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"></polygon></svg>`
  };

  // Animation utilities
  const animations = {
    springIn: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    springOut: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    easeOut: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    bounceIn: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    bounceOut: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
  };

  // Particle system
  let particleId = 0;
  const createParticles = (element, count = 8, type = 'enhance') => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = `${CLASSES.particle} ${type}`;
      particle.style.cssText = `
        position: fixed !important;
        left: ${centerX}px !important;
        top: ${centerY}px !important;
        width: 6px !important;
        height: 6px !important;
        border-radius: 50% !important;
        background: ${type === 'party' ? '#fbbf24' : '#10b981'} !important;
        pointer-events: none !important;
        z-index: 999999999 !important;
        transform: scale(0) !important;
        opacity: 1 !important;
      `;
      
      document.body.appendChild(particle);
      
      // Animate particle
      const angle = (i / count) * 360;
      const distance = type === 'party' ? 120 : 80;
      const x = Math.cos(angle * Math.PI / 180) * distance;
      const y = Math.sin(angle * Math.PI / 180) * distance;
      
      requestAnimationFrame(() => {
        particle.style.transition = `all ${type === 'party' ? '1.2s' : '0.8s'} ${animations.easeOut}`;
        particle.style.transform = `translate(${x}px, ${y}px) scale(${type === 'party' ? '1.5' : '1'})`;
        particle.style.opacity = '0';
      });
      
      setTimeout(() => particle.remove(), type === 'party' ? 1200 : 800);
    }
  };

  const $ = (selector, root = document) => safeQuerySelector(selector, root);
  const $$ = (selector, root = document) => safeQuerySelectorAll(selector, root);

  // Enhanced prompt element detection with fallbacks
  function getCurrentPromptElement() {
    return safeExecute(() => {
      // Priority 1: Currently focused element
      const active = document.activeElement;
      if (active?.isConnected && (active.matches?.('textarea') || active.isContentEditable)) {
        const text = ('value' in active) ? active.value : active.textContent;
        if (text && text.trim().length > 0) return active;
      }

      // Priority 2: Textarea/contenteditable with content
      const candidates = safeQuerySelectorAll('textarea, [contenteditable="true"]');
      for (const el of candidates) {
        if (!el?.isConnected) continue;
        const value = ('value' in el) ? el.value : el.textContent;
        if (value && value.trim().length > 0) return el;
      }

      // Priority 3: Any textarea/contenteditable (even empty)
      return candidates.find(el => el?.isConnected) || null;
    }, 'getCurrentPromptElement') || null;
  }

  function injectStyles() {
    if ($(`#prompto-styles`)) return;

    const style = document.createElement('style');
    style.id = 'prompto-styles';
    style.textContent = `
      .${CLASSES.btn} { 
        all: unset; 
        box-sizing: border-box; 
        cursor: pointer;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      .${CLASSES.wrapper} { 
        position: relative; 
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin: 0 6px; 
        padding: 0;
        background: none;
        border: none;
        vertical-align: middle;
        flex-shrink: 0;
        z-index: 999999999 !important;
        isolation: isolate;
        transform: translateZ(0);
      }

      .${CLASSES.fab} {
        position: relative;
        width: 32px; 
        height: 32px; 
        border-radius: 8px; 
        cursor: pointer;
        background: linear-gradient(135deg, #10b981 0%, #0d9488 100%);
        color: #fff; 
        display: inline-flex; 
        align-items: center; 
        justify-content: center;
        box-shadow: 0 2px 8px rgba(16, 185, 129, 0.25), 0 1px 4px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ${animations.springOut};
        z-index: 999999999 !important;
        isolation: isolate;
        transform: translateZ(0);
        border: 1px solid rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        font-size: 14px;
        user-select: none;
        outline: none;
        vertical-align: middle;
        flex-shrink: 0;
      }
      
      .${CLASSES.fab}:hover { 
        box-shadow: 0 4px 16px rgba(16, 185, 129, 0.35), 0 2px 8px rgba(0, 0, 0, 0.15); 
        transform: translateZ(0) scale(1.05);
        background: linear-gradient(135deg, #0d9488 0%, #10b981 100%);
      }
      
      .${CLASSES.fab}:active {
        transform: translateZ(0) scale(0.95);
        transition: all 0.15s ${animations.bounceOut};
      }
      
      .${CLASSES.child} {
        position: fixed; 
        width: 44px; 
        height: 44px; 
        border-radius: 22px;
        color: #fff; 
        display: flex;
        align-items: center; 
        justify-content: center; 
        cursor: pointer;
        transform: scale(0) translateZ(0);
        transform-origin: center; 
        opacity: 0;
        transition: all 0.4s ${animations.springIn};
        pointer-events: none;
        z-index: 999999999 !important;
        isolation: isolate;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        border: 1px solid rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        font-weight: 500;
      }
      
      .${CLASSES.child}.visible {
        transform: scale(1) translateZ(0);
        opacity: 1;
        pointer-events: auto;
      }
      
      .${CLASSES.child}:hover { 
        transform: scale(1.15) translateZ(0) !important; 
        transition: all 0.25s ${animations.bounceIn};
      }
      
      .${CLASSES.child}:active {
        transform: scale(0.95) translateZ(0) !important;
        transition: all 0.15s ${animations.bounceOut};
      }
      
      .${CLASSES.child}.enhance {
        background: linear-gradient(135deg, #10b981 0%, #0d9488 100%);
      }
      
      .${CLASSES.child}.enhance:hover {
        background: linear-gradient(135deg, #0d9488 0%, #059669 100%);
        box-shadow: 0 8px 32px rgba(16, 185, 129, 0.4);
      }
      
      .${CLASSES.child}.construction {
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        cursor: not-allowed;
        opacity: 0.8;
      }
      
      .${CLASSES.child}.construction:hover {
        background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
        transform: scale(1.05) translateZ(0) !important;
        box-shadow: 0 8px 32px rgba(245, 158, 11, 0.4);
      }
      
      .${CLASSES.child}.settings {
        background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
      }
      
      .${CLASSES.child}.settings:hover {
        background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
        box-shadow: 0 8px 32px rgba(139, 92, 246, 0.4);
      }
      
      /* Enhanced tooltip system */
      .${CLASSES.child}::after {
        content: attr(data-label);
        position: absolute;
        right: 54px;
        top: 50%;
        transform: translateY(-50%) scale(0.8);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 8px 14px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 500;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: all 0.3s ${animations.springOut};
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      }
      
      .${CLASSES.child}:hover::after {
        opacity: 1;
        transform: translateY(-50%) scale(1);
      }
      
      .${CLASSES.banner} {
        position: fixed; 
        top: 24px; 
        left: 50%; 
        transform: translateX(-50%) translateY(-120px); 
        background: linear-gradient(135deg, #10b981 0%, #0d9488 100%);
        color: white; 
        padding: 16px 28px; 
        border-radius: 16px;
        font-size: 15px; 
        font-weight: 600; 
        z-index: 999999999 !important;
        box-shadow: 0 10px 40px rgba(16, 185, 129, 0.3);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        transition: all 0.5s ${animations.springOut};
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        isolation: isolate;
        display: flex;
        align-items: center;
        gap: 12px;
        max-width: 90vw;
      }
      
      .${CLASSES.banner}.visible {
        transform: translateX(-50%) translateY(0);
      }
      
      .${CLASSES.banner}.success {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      }
      
      .${CLASSES.banner}.error {
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      }
      
      .${CLASSES.banner}.construction {
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      }
      
      .${CLASSES.banner}.info {
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      }
      
      /* Spinner animation */
      .prompto-spinner {
        animation: prompto-spin 1s linear infinite;
      }
      
      @keyframes prompto-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      /* Particle effects */
      .${CLASSES.particle} {
        will-change: transform, opacity;
        border-radius: 50% !important;
      }
      
      /* Enhancement overlay */
      .${CLASSES.overlay} {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(12px);
        z-index: 999999998;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        padding: 24px;
      }
      
      .${CLASSES.overlay}.visible {
        opacity: 1;
      }
      
      .${CLASSES.overlay} .content {
        background: rgba(15, 23, 42, 0.95);
        border-radius: 24px;
        border: 1px solid rgba(148, 163, 184, 0.2);
        backdrop-filter: blur(20px);
        max-width: 90vw;
        max-height: 85vh;
        overflow: hidden;
        transform: scale(0.9) translateY(40px);
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
      }
      
      .${CLASSES.overlay}.visible .content {
        transform: scale(1) translateY(0);
      }
      
      /* Typewriter effect */
      .${CLASSES.typewriter}::after {
        content: '|';
        color: #10b981;
        animation: prompto-blink 1s infinite;
      }
      
      @keyframes prompto-blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
      }
      
      /* Smooth transitions for all elements */
      .${CLASSES.fab} svg,
      .${CLASSES.child} svg {
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        will-change: transform;
      }
      
      /* Hover effects for icons */
      .${CLASSES.fab}:hover svg {
        transform: scale(1.1);
      }
      
      .${CLASSES.child}:hover svg {
        transform: scale(1.2);
      }
      
      /* Success checkmark animation */
      .${CLASSES.fab}.success {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
      }
      
      .${CLASSES.fab}.success svg {
        animation: prompto-checkmark 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }
      
      @keyframes prompto-checkmark {
        0% { transform: scale(0) rotate(-90deg); }
        50% { transform: scale(1.3) rotate(0deg); }
        100% { transform: scale(1) rotate(0deg); }
      }
      
      /* FAB rotation animation */
      .${CLASSES.fab}.open {
        transform: translateZ(0) rotate(45deg) !important;
      }
      
      .${CLASSES.fab}.open svg {
        transform: rotate(0deg);
      }
      
      /* Particle effects */
      .${CLASSES.particle} {
        will-change: transform, opacity;
      }
      
      /* Enhancement overlay */
      .${CLASSES.overlay} {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(12px);
        z-index: 999999998;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: all 0.4s ${animations.springOut};
        padding: 24px;
      }
      
      .${CLASSES.overlay}.visible {
        opacity: 1;
      }
      
      .${CLASSES.overlay} .content {
        background: rgba(15, 23, 42, 0.95);
        border-radius: 24px;
        border: 1px solid rgba(148, 163, 184, 0.2);
        backdrop-filter: blur(20px);
        max-width: 90vw;
        max-height: 85vh;
        overflow: hidden;
        transform: scale(0.9) translateY(40px);
        transition: all 0.4s ${animations.springOut};
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
      }
      
      .${CLASSES.overlay}.visible .content {
        transform: scale(1) translateY(0);
      }
      
      /* Typewriter effect */
      .${CLASSES.typewriter}::after {
        content: '|';
        color: #10b981;
        animation: prompto-blink 1s infinite;
      }
      
      @keyframes prompto-blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
      }
      
      /* Smooth transitions for all elements */
      .${CLASSES.fab} svg,
      .${CLASSES.child} svg {
        transition: all 0.3s ${animations.springOut};
        will-change: transform;
      }
      
      /* Hover effects for icons */
      .${CLASSES.fab}:hover svg {
        transform: scale(1.1);
      }
      
      .${CLASSES.child}:hover svg {
        transform: scale(1.2);
      }
    `;
    
    document.head.appendChild(style);
  }

  function findAnchor() {
    return safeExecute(() => {
      console.log('🚀 Prompto: Finding anchor for FAB positioning...');
      
      // Priority 1: Find the main chat input area (not follow-up or hover buttons)
      const mainTextarea = safeQuerySelector('main textarea[placeholder*="Спросите"], main textarea[placeholder*="Ask"], main form textarea, main [contenteditable="true"]');
      if (!mainTextarea?.isConnected) {
        console.log('🚀 Prompto: Main textarea not found');
        return null;
      }

      // Find the input container that holds the textarea and buttons
      const inputForm = mainTextarea.closest('form') || mainTextarea.closest('div[class*="composer"]') || mainTextarea.closest('div');
      if (!inputForm?.isConnected) {
        console.log('🚀 Prompto: Input form container not found');
        return null;
      }

      console.log('🚀 Prompto: Found main input container');

      // Priority 2: Look for the button container structure 
      // Find the container with trailing actions that holds all the buttons
      const trailingActions = safeQuerySelector('[data-testid="composer-trailing-actions"]', inputForm);
      if (trailingActions?.isConnected) {
        // Find the flex container that holds the buttons (.ms-auto.flex.items-center.gap-1.5)
        const buttonGroup = safeQuerySelector('.ms-auto.flex.items-center', trailingActions);
        if (buttonGroup?.isConnected) {
          // Look for the speech button container (it should be the last item)
          const speechContainer = safeQuerySelector('[data-testid="composer-speech-button-container"]', buttonGroup);
          if (speechContainer?.isConnected) {
            console.log('🚀 Prompto: Found speech container, positioning before it in button group');
            return { element: speechContainer, position: 'before' };
          }
          
          // Fallback: Look for any child elements and position before the last one
          const children = Array.from(buttonGroup.children).filter(child => 
            child?.isConnected && getComputedStyle(child).display !== 'none'
          );
          if (children.length > 0) {
            console.log('🚀 Prompto: Found button group children, positioning before last one');
            return { element: children[children.length - 1], position: 'before' };
          }
          
          console.log('🚀 Prompto: Found empty button group, appending to it');
          return { element: buttonGroup, position: 'append' };
        }
      }

      // Priority 3: Original speech button fallback
      const speechButton = safeQuerySelector('button[data-testid="composer-speech-button"]', inputForm);
      if (speechButton?.isConnected) {
        const rect = speechButton.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0 && getComputedStyle(speechButton).display !== 'none') {
          console.log('🚀 Prompto: Found speech button, positioning before it');
          return { element: speechButton, position: 'before' };
        }
      }

      // Priority 4: Look for the microphone/dictation button (классная кнопка диктовки)
      const micButton = safeQuerySelector('button[aria-label*="диктовки"], button[aria-label*="Кнопка диктовки"], button.composer-btn', inputForm);
      if (micButton?.isConnected) {
        const rect = micButton.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0 && getComputedStyle(micButton).display !== 'none') {
          console.log('🚀 Prompto: Found dictation button, positioning after it');
          return { element: micButton, position: 'after' };
        }
      }

      // Priority 5: Look for any voice-related buttons
      const voiceButtons = safeQuerySelectorAll('button[aria-label*="voice"], button[aria-label*="Voice"], button[aria-label*="голос"], button[aria-label*="микрофон"]', inputForm);
      for (const btn of voiceButtons) {
        if (btn?.isConnected) {
          const rect = btn.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0 && getComputedStyle(btn).display !== 'none') {
            console.log('🚀 Prompto: Found voice button, positioning after it');
            return { element: btn, position: 'after' };
          }
        }
      }

      // Priority 6: Look for send button as fallback
      const sendButton = safeQuerySelector('button[data-testid="send-button"], button[type="submit"]', inputForm);
      if (sendButton?.isConnected) {
        const rect = sendButton.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0 && getComputedStyle(sendButton).display !== 'none') {
          console.log('🚀 Prompto: Found send button, positioning before it');
          return { element: sendButton, position: 'before' };
        }
      }

      // Priority 7: Look for all buttons in the input form and position before the last one
      const allButtons = safeQuerySelectorAll('button', inputForm)
        .filter(btn => {
          if (!btn?.isConnected) return false;
          const rect = btn.getBoundingClientRect();
          const style = getComputedStyle(btn);
          return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
        });

      if (allButtons.length > 0) {
        console.log('🚀 Prompto: Using last button in form as anchor, found', allButtons.length, 'buttons');
        return { element: allButtons[allButtons.length - 1], position: 'before' };
      }

      console.log('🚀 Prompto: No suitable anchor found in main input area');
      return null;
    }, 'findAnchor');
  }

  function showBanner(message, type = 'info', icon = null, progress = null) {
    return safeExecute(() => {
      if (!message || typeof message !== 'string') {
        console.warn('🚀 Prompto: Invalid banner message:', message);
        return null;
      }

      // Clean up existing banners safely
      safeQuerySelectorAll(`.${CLASSES.banner}`).forEach(b => {
        try {
          if (b?.isConnected) b.remove();
        } catch (e) {
          console.warn('🚀 Prompto: Error removing banner:', e);
        }
      });

      const banner = document.createElement('div');
      const bannerId = `banner-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      banner.id = bannerId;
      banner.className = `${CLASSES.banner} ${type}`;
      
      if (icon && typeof icon === 'string') {
        banner.innerHTML = `${icon}<span>${message}</span>`;
      } else {
        banner.textContent = message;
      }
      
      // Add progress bar if specified and valid
      if (typeof progress === 'number' && progress >= 0 && progress <= 100) {
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.style.cssText = `
          position: absolute; bottom: 0; left: 0; height: 3px;
          background: rgba(255,255,255,0.3); border-radius: 0 0 12px 12px;
          width: ${Math.max(0, Math.min(100, progress))}%; transition: width 0.3s ease;
        `;
        banner.appendChild(progressBar);
      }
      
      if (document.body?.isConnected) {
        document.body.appendChild(banner);
        requestAnimationFrame(() => {
          if (banner?.isConnected) {
            banner.classList.add('visible');
          }
        });
      } else {
        console.warn('🚀 Prompto: Document body not available for banner');
        return null;
      }
      
      // Auto-dismiss with safety checks
      if (type !== 'error' && type !== 'warn') {
        setTimeout(() => {
          const bannerElement = document.getElementById(bannerId);
          if (bannerElement?.isConnected) {
            bannerElement.classList.remove('visible');
            setTimeout(() => {
              if (bannerElement?.isConnected) {
                bannerElement.remove();
              }
            }, 400);
          }
        }, 3000);
      }
      
      return bannerId;
    }, 'showBanner');
  }

  function showToast(message, type = 'info') {
    return safeExecute(() => {
      if (!message || typeof message !== 'string') return;

      safeQuerySelectorAll(`.${CLASSES.toast}`).forEach(t => {
        try {
          if (t?.isConnected) t.remove();
        } catch (e) {
          console.warn('🚀 Prompto: Error removing toast:', e);
        }
      });

      const toast = document.createElement('div');
      toast.className = `${CLASSES.toast} ${type}`;
      toast.textContent = message;
      
      if (document.body?.isConnected) {
        document.body.appendChild(toast);
        requestAnimationFrame(() => {
          if (toast?.isConnected) {
            toast.classList.add('visible');
          }
        });
        
        setTimeout(() => {
          if (toast?.isConnected) {
            toast.classList.remove('visible');
            setTimeout(() => {
              if (toast?.isConnected) toast.remove();
            }, 300);
          }
        }, 2400);
      }
    }, 'showToast');
  }

  // Bulletproof enhancement overlay with comprehensive error handling
  function showEnhancementOverlay({ textarea, original, enhanced, strategy }) {
    return safeExecute(() => {
      // Validate inputs
      if (!textarea?.isConnected || !enhanced || typeof enhanced !== 'string') {
        console.error('🚀 Prompto: Invalid overlay parameters:', { textarea: !!textarea, enhanced: !!enhanced });
        return;
      }

      // Clean up existing overlays safely
      safeQuerySelectorAll(`.${CLASSES.banner}.review`).forEach(o => {
        try {
          if (o?.isConnected) o.remove();
        } catch (e) {
          console.warn('🚀 Prompto: Error removing overlay:', e);
        }
      });

      const overlay = document.createElement('div');
      overlay.className = `${CLASSES.banner} review`;
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-labelledby', 'prompto-review-title');
      overlay.style.maxWidth = '580px';
      overlay.style.background = 'rgba(24,24,27,0.9)';
      overlay.style.border = '1px solid #3f3f46';
      overlay.style.backdropFilter = 'blur(8px)';
      
      const safeStrategy = (strategy || 'Prompt Enhancement Suggestion').replace(/[<>]/g, '');
      overlay.innerHTML = `
         <div id="prompto-review-title" style="font-size:13px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${safeStrategy}</div>
         <div style="margin-top:6px;display:inline-flex;gap:12px;">
           <button class="accept" style="all:unset;cursor:pointer;padding:0 12px;height:20px;font-size:11px;border-radius:2px;background:#10b981;color:#fff;">Accept</button>
           <button class="reject" style="all:unset;cursor:pointer;padding:0 12px;height:20px;font-size:11px;border-radius:2px;color:#d1d5db;">Reject</button>
           <a style="font-size:11px;color:#a1a1aa;text-decoration:underline dotted 1px #52525b;cursor:pointer;" tabindex="-1">Follow-up instructions…</a>
         </div>
      `;

      const composerRow = textarea.closest('form') || textarea.parentElement;
      if (!composerRow?.isConnected) {
        console.error('🚀 Prompto: Cannot find composer container');
        return;
      }

      if (getComputedStyle(composerRow).position === 'static') {
        composerRow.style.position = 'relative';
      }
      composerRow.appendChild(overlay);

      // Safe positioning
      try {
        overlay.style.position = 'absolute';
        overlay.style.top = `-${overlay.offsetHeight + 16}px`;
        overlay.style.left = '50%';
        overlay.style.transform = 'translateX(-50%)';
      } catch (e) {
        console.warn('🚀 Prompto: Error positioning overlay:', e);
      }

      // Store original styles safely
      textarea.dataset.oldStyle = textarea.getAttribute('style') || '';
      textarea.dataset.oldHeight = textarea.style.height || '';
      textarea.dataset.oldOverflow = textarea.style.overflowY || '';
      
      // Apply enhancement styles with error handling
      try {
        textarea.style.background = '#14532d';
        textarea.style.color = '#f0fdf4';
        textarea.style.border = '1px solid #22c55e';
        textarea.style.boxShadow = 'inset 0 32px #7f1d1d';
      } catch (e) {
        console.warn('🚀 Prompto: Error applying styles:', e);
      }

      // Auto-grow logic with safety checks
      function autoGrow(el) {
        if (!el?.isConnected) return;
        try {
          el.style.height = 'auto';
          el.style.overflowY = 'hidden';
          const max = Math.max(200, window.innerHeight * 0.4);
          const newH = Math.min(el.scrollHeight + 2, max);
          el.style.height = newH + 'px';
          if (newH >= max) {
            el.style.overflowY = 'auto';
          }
        } catch (e) {
          console.warn('🚀 Prompto: Error in autoGrow:', e);
        }
      }

      textarea.classList.add('prompto-preview');
      autoGrow(textarea);
      const growHandler = () => autoGrow(textarea);
      textarea.addEventListener('input', growHandler);

      // Suggestion preview overlay with safety
      const container = textarea.parentElement;
      if (!container?.isConnected) {
        console.warn('🚀 Prompto: Container not available for suggestion overlay');
        return;
      }

      if (getComputedStyle(container).position === 'static') {
        container.style.position = 'relative';
      }

      const suggestion = document.createElement('div');
      suggestion.className = 'prompto-suggestion';
      suggestion.textContent = enhanced;

      Object.assign(suggestion.style, {
        position: 'absolute',
        inset: '0',
        padding: '8px',
        background: '#14532d',
        color: '#f0fdf4',
        border: '1px solid #22c55e',
        borderRadius: getComputedStyle(textarea).borderRadius || '4px',
        whiteSpace: 'pre-wrap',
        fontFamily: 'inherit',
        fontSize: 'inherit',
        lineHeight: 'inherit',
        pointerEvents: 'none',
        overflowY: 'auto',
        zIndex: '999999998',
        opacity: '0.95',
        boxSizing: 'border-box'
      });

      container.appendChild(suggestion);

      function syncSuggestionSize() {
        if (!suggestion?.isConnected || !textarea?.isConnected) return;
        try {
          suggestion.style.borderRadius = getComputedStyle(textarea).borderRadius || '4px';
        } catch (e) {
          console.warn('🚀 Prompto: Error syncing suggestion size:', e);
        }
      }

      let resizeObserver = null;
      try {
        resizeObserver = new ResizeObserver(syncSuggestionSize);
        resizeObserver.observe(textarea);
      } catch (e) {
        console.warn('🚀 Prompto: ResizeObserver not available:', e);
      }

      // Safe event handlers
      const acceptBtn = overlay.querySelector('.accept');
      const rejectBtn = overlay.querySelector('.reject');

      if (acceptBtn) {
        acceptBtn.onclick = apply;
      }
      if (rejectBtn) {
        rejectBtn.onclick = cleanup;
      }

      function apply() {
        safeExecute(() => {
          if (!textarea?.isConnected) return;
          
          if ('value' in textarea) {
            textarea.value = enhanced;
          } else {
            textarea.textContent = enhanced;
          }
          
          // Trigger input event safely
          try {
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
          } catch (e) {
            console.warn('🚀 Prompto: Error dispatching input event:', e);
          }
          
          cleanup();
          showToast('Prompt enhanced!', 'success');
        }, 'apply');
      }

      function cleanup() {
        safeExecute(() => {
          // Remove overlay
          if (overlay?.isConnected) overlay.remove();
          
          // Remove suggestion
          if (suggestion?.isConnected) suggestion.remove();
          
          // Disconnect observer
          if (resizeObserver) {
            try {
              resizeObserver.disconnect();
            } catch (e) {
              console.warn('🚀 Prompto: Error disconnecting observer:', e);
            }
          }
          
          // Restore textarea styles
          if (textarea?.isConnected) {
            try {
              textarea.setAttribute('style', textarea.dataset.oldStyle || '');
              textarea.classList.remove('prompto-preview');
              textarea.style.height = textarea.dataset.oldHeight || '';
              textarea.style.overflowY = textarea.dataset.oldOverflow || '';
            } catch (e) {
              console.warn('🚀 Prompto: Error restoring styles:', e);
            }
          }
          
          // Remove event listeners
          if (textarea && growHandler) {
            textarea.removeEventListener('input', growHandler);
          }
          document.removeEventListener('keydown', onKey);
          document.removeEventListener('mousedown', clickAway, true);
          window.removeEventListener('resize', syncSuggestionSize);
          textarea?.removeEventListener('input', syncSuggestionSize);
        }, 'cleanup');
      }

      function onKey(e) {
        if (e.key === 'Enter') { e.preventDefault(); apply(); }
        if (e.key === 'Escape') { e.preventDefault(); cleanup(); }
      }

      function clickAway(e) {
        if (overlay?.isConnected && !overlay.contains(e.target)) {
          cleanup();
        }
      }

      document.addEventListener('keydown', onKey);
      document.addEventListener('mousedown', clickAway, { capture: true });
      
    }, 'showEnhancementOverlay');
  }

  function enhancePrompt(textarea) {
    return safeExecute(() => {
      // Validate and get textarea
      if (!textarea || !textarea.isConnected) {
        textarea = getCurrentPromptElement();
      }
      
      if (!textarea || !textarea.isConnected) {
        console.warn('🚀 Prompto: No valid textarea found');
        return showBanner('📝 Please click in a text area first', 'warn', ICONS.sparkles);
      }

      // Get text content safely
      let text = '';
      try {
        text = ('value' in textarea) ? textarea.value : textarea.textContent;
        text = (text || '').trim();
      } catch (e) {
        console.error('🚀 Prompto: Error getting text content:', e);
        return showBanner('❌ Error reading text content', 'error', '⚠️');
      }

      // Retry logic for better textarea detection
      if (text.length < 5) {
        const alt = getCurrentPromptElement();
        if (alt && alt !== textarea && alt.isConnected) {
          try {
            const altText = ('value' in alt) ? alt.value : alt.textContent;
            if (altText && altText.trim().length >= 5) {
              textarea = alt;
              text = altText.trim();
            }
          } catch (e) {
            console.warn('🚀 Prompto: Error with alternative textarea:', e);
          }
        }
      }

      // Validate minimum text length
      if (text.length < 5) {
        return showBanner('📝 Enter at least 5 characters to enhance', 'warn', ICONS.sparkles);
      }

      // Validate maximum text length
      if (text.length > 5000) {
        return showBanner('📝 Text too long (max 5000 characters)', 'warn', ICONS.sparkles);
      }

      // Start enhancement process
      console.log('🚀 Prompto: Starting enhancement, showing banner...');
      
      // Create particle burst effect from FAB
      const fab = safeQuerySelector(`.${CLASSES.fab}`);
      if (fab) {
        createParticles(fab, 12, 'enhance');
      }
      
      const startTime = Date.now();
      let progress = 0;
      const bannerId = showBanner('⚡ AI enhancement in progress...', 'info', ICONS.spinner, progress);
      
      if (!bannerId) {
        console.error('🚀 Prompto: Failed to create banner');
        return;
      }

      console.log('🚀 Prompto: Banner ID:', bannerId);
      
      // Progress simulation with safety checks
      const progressInterval = setInterval(() => {
        progress = Math.min(progress + Math.random() * 15 + 5, 85);
        const banner = document.getElementById(bannerId);
        if (banner?.isConnected) {
          const progressBar = banner.querySelector('.progress-bar');
          if (progressBar) {
            progressBar.style.width = `${progress}%`;
          }
        } else {
          clearInterval(progressInterval);
        }
      }, 100);
      
      // Timeout handler for slow responses
      const timeoutId = setTimeout(() => {
        clearInterval(progressInterval);
        showBanner('🐌 Backend response is slow - check server performance', 'warn', '⏱️');
      }, 2000);
      
      // Chrome runtime message with comprehensive error handling
      try {
        chrome.runtime.sendMessage({ action: 'enhancePrompt', prompt: text }, (response) => {
          console.log('🚀 Prompto: Received response:', response);
          
          // Cleanup intervals
          clearInterval(progressInterval);
          clearTimeout(timeoutId);
          const duration = Date.now() - startTime;
          
          // Remove loading banner safely
          const banner = document.getElementById(bannerId);
          if (banner?.isConnected) {
            banner.classList.remove('visible');
            setTimeout(() => {
              if (banner?.isConnected) banner.remove();
            }, 400);
          }
          
          // Check for Chrome runtime errors
          if (chrome.runtime.lastError) {
            console.error('🚀 Prompto: Chrome runtime error:', chrome.runtime.lastError);
            return showBanner('❌ Extension communication error', 'error', '⚠️');
          }
          
          // Validate response
          if (!response) {
            console.error('🚀 Prompto: No response received');
            return showBanner('❌ No response from extension', 'error', '⚠️');
          }
          
          // Handle enhancement failure
          if (!response.success) {
            const errorMsg = response.error || 'Enhancement failed';
            console.error('🚀 Prompto: Enhancement failed:', errorMsg);
            
            let displayMsg = '❌ Enhancement failed';
            if (errorMsg.includes('Backend not running') || errorMsg.includes('fetch')) {
              displayMsg = '🔌 Backend server is offline - Please start the backend';
            } else if (errorMsg.includes('timeout')) {
              displayMsg = '⏱️ Request timed out - Try again';
            } else if (errorMsg.includes('network')) {
              displayMsg = '🌐 Network error - Check connection';
            } else {
              displayMsg = `❌ Enhancement failed: ${errorMsg}`;
            }
            
            return showBanner(displayMsg, 'error', '⚠️');
          }
          
          // Validate enhanced content
          if (!response.enhanced || typeof response.enhanced !== 'string') {
            console.error('🚀 Prompto: Invalid enhanced content:', response.enhanced);
            return showBanner('❌ Invalid response format', 'error', '⚠️');
          }
          
          // Show success animation on FAB
          const fab = safeQuerySelector(`.${CLASSES.fab}`);
          if (fab) {
            fab.classList.add('success');
            fab.innerHTML = ICONS.check;
            createParticles(fab, 20, 'party');
            
            // Reset FAB after animation
            setTimeout(() => {
              fab.classList.remove('success');
              fab.innerHTML = ICONS.plus;
            }, 1500);
          }
          
          // Success feedback with performance metrics
          const speedEmoji = duration < 1000 ? '⚡' : duration < 3000 ? '🚀' : '🐌';
          const providerEmoji = response.provider === 'cache' ? '⚡' : response.provider === 'openai' ? '🤖' : response.provider === 'gemini' ? '🧠' : '🔧';
          const cacheStatus = response.cached ? 'Cached' : 'Fresh';
          const techniqueInfo = response.techniquesApplied ? ` (${response.techniquesApplied} techniques)` : '';
          const performanceInfo = response.responseTime ? ` - ${response.responseTime}ms` : '';
          showToast(`${providerEmoji} ${speedEmoji} Enhanced${techniqueInfo}${performanceInfo} - ${cacheStatus}`, 'success');
          
          console.log('🚀 Prompto: Showing enhancement overlay...');
          
          // Show enhancement overlay with final validation
          if (textarea?.isConnected) {
            showEnhancementOverlay({
              textarea,
              original: text,
              enhanced: response.enhanced,
              strategy: response.strategy || 'Prompt Enhancement Suggestion'
            });
          } else {
            console.error('🚀 Prompto: Textarea no longer connected');
            showBanner('❌ Text area is no longer available', 'error', '⚠️');
          }
        });
      } catch (e) {
        // Cleanup on error
        clearInterval(progressInterval);
        clearTimeout(timeoutId);
        
        const banner = document.getElementById(bannerId);
        if (banner?.isConnected) {
          banner.classList.remove('visible');
          setTimeout(() => {
            if (banner?.isConnected) banner.remove();
          }, 400);
        }
        
        console.error('🚀 Prompto: Error sending message:', e);
        showBanner('❌ Extension communication failed', 'error', '⚠️');
      }
      
    }, 'enhancePrompt');
  }

  function createChild(fab, index, icon, title, callback, className = '', label = '') {
    return safeExecute(() => {
      if (!fab?.isConnected || !icon || !title || typeof callback !== 'function') {
        console.warn('🚀 Prompto: Invalid createChild parameters');
        return null;
      }

      const child = document.createElement('button');
      child.type = 'button';
      child.className = `${CLASSES.btn} ${CLASSES.child} ${className}`;
      child.title = title;
      child.innerHTML = icon;
      child.setAttribute('data-label', label || title);
      child.setAttribute('data-index', index);
      
      child.onclick = (e) => {
        safeExecute(() => {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          callback();
          toggleSpeedDial(fab);
        }, 'childClick');
      };
      
      // Apply initial styles without conflicting specificity
      child.style.cssText = `
        position: fixed !important; 
        z-index: 999999999 !important; 
        isolation: isolate !important;
        transform-style: preserve-3d !important;
      `;
      
      if (document.body?.isConnected) {
        document.body.appendChild(child);
        positionChild(child, fab, index);
        
        // Immediate visibility with staggered animation
        requestAnimationFrame(() => {
          if (child?.isConnected) {
            child.classList.add('visible');
            console.log(`🚀 Prompto: Child ${index} made visible`);
          }
        });
        
        return child;
      } else {
        console.warn('🚀 Prompto: Document body not available for child');
        return null;
      }
    }, 'createChild');
  }

  function positionChild(child, fab, index) {
    safeExecute(() => {
      if (!child?.isConnected || !fab?.isConnected || typeof index !== 'number') {
        return;
      }

      const fabRect = fab.getBoundingClientRect();
      if (fabRect.width === 0 || fabRect.height === 0) {
        console.warn('🚀 Prompto: FAB has no dimensions for positioning');
        return;
      }

      const fabCenterX = fabRect.left + fabRect.width / 2;
      const fabTop = fabRect.top;
      
      const childX = Math.max(0, fabCenterX - 20);
      const childY = Math.max(0, fabTop - (65 + (50 * (index - 1))));
      
      child.style.left = `${childX}px`;
      child.style.top = `${childY}px`;
    }, 'positionChild');
  }

  function mountFAB() {
    return safeExecute(() => {
      // Prevent duplicate mounting
      if (safeQuerySelector(`.${CLASSES.wrapper}`)) {
        return;
      }

      const anchorInfo = findAnchor();
      if (!anchorInfo) {
        console.log('🚀 Prompto: No anchor found, retrying...');
        return;
      }

      const { element: anchor, position } = anchorInfo;
      if (!anchor?.isConnected) {
        console.warn('🚀 Prompto: Anchor element not connected');
        return;
      }

      const parent = anchor.parentElement;
      if (!parent?.isConnected) {
        console.warn('🚀 Prompto: No valid parent for anchor');
        return;
      }

      console.log('🚀 Prompto: Mounting FAB at anchor:', anchor, 'position:', position);

      const wrapper = document.createElement('div');
      wrapper.className = CLASSES.wrapper;
      wrapper.style.cssText = `
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        margin: 0 6px !important;
        padding: 0 !important;
        background: none !important;
        border: none !important;
        vertical-align: middle !important;
        flex-shrink: 0 !important;
      `;

      const fab = document.createElement('button');
      fab.type = 'button';
      fab.className = `${CLASSES.btn} ${CLASSES.fab}`;
      fab.innerHTML = ICONS.plus;
      fab.title = 'Prompto AI Assistant';
      fab.dataset.open = '0';
      
      fab.onclick = (e) => {
        safeExecute(() => {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          toggleSpeedDial(fab);
        }, 'fabClick');
      };

      fab.style.cssText = `
        position: relative !important; 
        z-index: 999999999 !important; 
        isolation: isolate !important;
        transform: translateZ(0) !important;
        transform-style: preserve-3d !important;
        width: 32px !important;
        height: 32px !important;
        min-width: 32px !important;
        min-height: 32px !important;
        border-radius: 8px !important;
        border: none !important;
        outline: none !important;
        cursor: pointer !important;
        user-select: none !important;
        flex-shrink: 0 !important;
      `;

      wrapper.appendChild(fab);

      try {
        if (position === 'after') {
          parent.insertBefore(wrapper, anchor.nextSibling);
        } else if (position === 'append') {
          anchor.appendChild(wrapper);
        } else {
          parent.insertBefore(wrapper, anchor);
        }
        
        console.log('🚀 Prompto: FAB mounted successfully with position:', position);
        currentAnchor = anchor;
      } catch (e) {
        console.error('🚀 Prompto: Error mounting FAB:', e);
        if (wrapper?.isConnected) wrapper.remove();
      }
    }, 'mountFAB');
  }

  function updateChildPositions() {
    safeExecute(() => {
      const fab = safeQuerySelector(`.${CLASSES.fab}`);
      const children = safeQuerySelectorAll(`.${CLASSES.child}`);
      
      if (!fab?.isConnected || children.length === 0) return;
      
      children.forEach((child) => {
        if (!child?.isConnected) return;
        
        const index = parseInt(child.getAttribute('data-index') || '1');
        if (!isNaN(index)) {
          positionChild(child, fab, index);
        }
      });
    }, 'updateChildPositions');
  }

  function enforceZIndex() {
    safeExecute(() => {
      const wrapper = safeQuerySelector(`.${CLASSES.wrapper}`);
      const fab = safeQuerySelector(`.${CLASSES.fab}`);
      const children = safeQuerySelectorAll(`.${CLASSES.child}`);
      
      if (wrapper?.isConnected) {
        wrapper.style.zIndex = '999999999';
        wrapper.style.isolation = 'isolate';
        if (!wrapper.style.transform.includes('translateZ')) {
          wrapper.style.transform = (wrapper.style.transform || '') + ' translateZ(0)';
        }
      }
      
      if (fab?.isConnected) {
        fab.style.zIndex = '999999999';
        fab.style.isolation = 'isolate';
        if (!fab.style.transform.includes('translateZ')) {
          fab.style.transform = (fab.style.transform || '') + ' translateZ(0)';
        }
      }
      
      children.forEach(child => {
        if (!child?.isConnected) return;
        child.style.zIndex = '999999999';
        child.style.isolation = 'isolate';
        if (!child.style.transform.includes('translateZ')) {
          child.style.transform = (child.style.transform || '') + ' translateZ(0)';
        }
      });
      
      updateChildPositions();
    }, 'enforceZIndex');
  }

  function openSpeedDial(fab) {
    console.log('🚀 Prompto: Opening speed dial', fab.getBoundingClientRect());

    // Clear any existing child buttons first
    const existingChildren = document.querySelectorAll(`.${CLASSES.child}`);
    existingChildren.forEach(child => child.remove());

    console.log('🚀 Prompto: Creating child buttons...');

    // Enhance Prompt Button – green with sparkles
    const enhanceChild = createChild(
      fab,
      1,
      ICONS.sparkles,
      'Enhance Prompt with Advanced Techniques',
      () => enhancePrompt(getCurrentPromptElement()),
      'enhance',
      'Enhance Prompt'
    );
    console.log('🚀 Prompto: Created enhance button:', enhanceChild);

    // Token Optimizer Button – orange construction placeholder
    const tokenChild = createChild(
      fab,
      2,
      ICONS.construction,
      'Token Optimizer (Under Construction)',
      () => showBanner('🚧 Token Optimizer is under construction! Coming soon with advanced compression algorithms.', 'construction', ICONS.construction),
      'construction',
      'Token Optimizer'
    );
    console.log('🚀 Prompto: Created token optimizer button:', tokenChild);

    // Advanced Settings Button – blue settings icon
    const settingsChild = createChild(
      fab,
      3,
      ICONS.settings,
      'Advanced Technique Configuration',
      () => {
        // Open dashboard with advanced settings parameter
        const dashboardUrl = 'http://localhost:5176?settings=advanced';
        window.open(dashboardUrl, '_blank');
        showBanner('🚀 Opening Advanced Settings in Dashboard...', 'info', ICONS.settings);
      },
      'settings',
      'Advanced Settings'
    );
    console.log('🚀 Prompto: Created settings button:', settingsChild);
    
    // Force immediate positioning and visibility
    setTimeout(() => {
      updateChildPositions();
      console.log('🚀 Prompto: Updated child positions');
      
      // Double-check visibility
      const children = document.querySelectorAll(`.${CLASSES.child}`);
      console.log(`🚀 Prompto: Found ${children.length} child buttons after creation`);
      children.forEach((child, index) => {
        console.log(`🚀 Prompto: Child ${index + 1} - Classes:`, child.className, 'Visible:', getComputedStyle(child).opacity);
      });
    }, 100);
    
    document.addEventListener('click', function closeOnClickAway(e) {
      // Check if click is on fab or any child button
      const isClickOnFab = fab.contains(e.target);
      const isClickOnChild = e.target.closest(`.${CLASSES.child}`);
      
      if (!isClickOnFab && !isClickOnChild) {
        console.log('🚀 Prompto: Clicking away from speed dial');
        toggleSpeedDial(fab);
      }
    }, { capture: true, once: true });
  }

  function closeSpeedDial(fab) {
    // Find all child buttons and animate them out with stagger
    const children = document.querySelectorAll(`.${CLASSES.child}`);
    children.forEach((child, index) => {
      setTimeout(() => {
        child.classList.remove('visible');
        setTimeout(() => {
          if (child?.isConnected) child.remove();
        }, 400);
      }, index * 50); // Stagger exit animation
    });
  }

  function toggleSpeedDial(fab) {
    const isOpen = fab.dataset.open === '1';
    fab.dataset.open = isOpen ? '0' : '1';
    
    console.log(`🚀 Prompto: Toggling speed dial - ${isOpen ? 'closing' : 'opening'}`);
    
    // Enhanced animation with rotation
    if (isOpen) {
      fab.classList.remove('open');
      fab.innerHTML = ICONS.plus;
      fab.style.transform = 'rotate(0deg) translateZ(0)';
      fab.style.background = 'linear-gradient(135deg, #10b981 0%, #0d9488 100%)';
      closeSpeedDial(fab);
    } else {
      fab.classList.add('open');
      fab.innerHTML = ICONS.x;
      fab.style.transform = 'rotate(45deg) translateZ(0)';
      fab.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      openSpeedDial(fab);
    }
  }

  let currentAnchor = null; // stores anchor element for repositioning

  function initialize() {
    injectStyles();
    
    let mountTimeout;
    const observer = new MutationObserver(() => {
        clearTimeout(mountTimeout);
        mountTimeout = setTimeout(mountFAB, 500);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            setTimeout(mountFAB, 1000);
        }
    });

    // Periodically enforce z-index to prevent ChatGPT from overriding
    setInterval(enforceZIndex, 2000);

    // Update child positions on scroll and resize
    window.addEventListener('scroll', updateChildPositions, { passive: true });
    window.addEventListener('resize', updateChildPositions, { passive: true });

    setTimeout(mountFAB, 2000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();

