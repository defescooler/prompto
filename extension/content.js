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
    btn: 'prompto-btn'
  };

  const ICONS = {
    plus: '<svg viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="12" fill="url(#prompto-grad)"/><svg x="4" y="4" width="16" height="16" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet"><path d="M275 0H325V150H275V0ZM275 450H325V600H275V450ZM0 325V275H150V325H0ZM450 325V275H600V325H450ZM70.2 105.5L105.55 70.2L211.6 176.25L176.25 211.6L70.2 105.55V105.5ZM388.4 423.75L423.75 388.4L529.8 494.45L494.45 529.8L388.4 423.75ZM105.85 529.5L70.5 494.15L176.25 388.4L211.6 423.75L105.85 529.5ZM423.75 211.6L388.4 176.25L494.45 70.2L529.8 105.55L423.75 211.6Z" fill="white"/></svg></svg>',
    minus: '<svg viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="12" fill="url(#prompto-grad)"/><svg x="4" y="4" width="16" height="16" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet"><rect x="150" y="275" width="300" height="50" fill="white"/></svg></svg>',
    sparkles: '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M4.85,10.87 C4.91,10.73 5.09,10.73 5.15,10.87 L5.29,11.16 C5.89,12.4 6.85,13.45 8.05,14.15 L8.26,14.27 C8.36,14.32 8.36,14.48 8.26,14.53 L8.05,14.65 C6.85,15.35 5.89,16.4 5.29,17.64 L5.15,17.93 C5.09,18.07 4.91,18.07 4.85,17.93 L4.71,17.64 C4.11,16.4 3.15,15.35 1.95,14.65 L1.74,14.53 C1.64,14.48 1.64,14.32 1.74,14.27 L1.95,14.15 C3.15,13.45 4.11,12.4 4.71,11.16 L4.85,10.87 Z M12.11,2.29 C12.21,2.04 12.54,2.04 12.64,2.29 L12.77,2.58 L12.89,2.85 L13.05,3.21 L13.16,3.44 C13.97,5.05 15.16,6.46 16.64,7.54 L16.99,7.78 C17.24,7.95 17.49,8.11 17.75,8.26 C17.87,8.33 18,8.4 18.13,8.46 C18.31,8.56 18.31,8.81 18.13,8.91 C18,8.97 17.87,9.04 17.75,9.11 C17.56,9.22 17.37,9.34 17.19,9.47 L16.84,9.71 C15.36,10.79 14.17,12.2 13.36,13.81 L13.25,14.04 C13.14,14.27 13.04,14.5 12.95,14.74 L12.83,15.01 L12.7,15.28 C12.6,15.53 12.27,15.53 12.17,15.28 L12.04,15.01 L11.92,14.74 L11.76,14.38 L11.65,14.15 C10.84,12.54 9.65,11.13 8.17,10.05 L7.82,9.81 C7.57,9.64 7.32,9.48 7.06,9.33 C6.94,9.26 6.81,9.19 6.68,9.13 C6.5,9.03 6.5,8.78 6.68,8.68 C6.81,8.62 6.94,8.55 7.06,8.48 C7.25,8.37 7.44,8.25 7.62,8.12 L7.97,7.88 C9.45,6.8 10.64,5.39 11.45,3.78 L11.56,3.55 C11.67,3.32 11.77,3.09 11.86,2.85 L11.98,2.58 L12.11,2.29 Z M12.35,5.29 C11.52,6.54 10.46,7.65 9.22,8.55 C10.46,9.45 11.52,10.56 12.35,11.81 C13.18,10.56 14.24,9.45 15.48,8.55 C14.24,7.65 13.18,6.54 12.35,5.29 Z" fill="#fff"/></svg>',
    zap: '<svg viewBox="0 0 20 20" width="20" height="20"><path d="M10 2 4 12h5v6l6-10h-5V2z" fill="#fff"/></svg>',
    spinner: '<svg viewBox="0 0 20 20" width="20" height="20"><circle cx="10" cy="10" r="8" stroke="#fff" stroke-width="2" fill="none" stroke-dasharray="32" stroke-dashoffset="16"><animate attributeName="stroke-dashoffset" values="16;0;-16" dur="1s" repeatCount="indefinite"/></circle></svg>',
    construction: '<svg viewBox="0 0 36 36" width="20" height="20"><path fill="#FFCC4D" d="M36 15a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4h28a4 4 0 0 1 4 4v8z"></path><path d="M6 3H4a4 4 0 0 0-4 4v2l6-6zm6 0L0 15c0 1.36.682 2.558 1.72 3.28L17 3h-5zM7 19h5L28 3h-5zm16 0L35.892 6.108A3.995 3.995 0 0 0 33.64 3.36L18 19h5zm13-4v-3l-7 7h3a4 4 0 0 0 4-4z" fill="#292F33"></path><path fill="#99AAB5" d="M4 19h5v14H4zm23 0h5v14h-5z"></path></svg>',
    settings: '<svg viewBox="0 0 20 20" width="20" height="20"><path d="M15.0007 10C15.0007 11.6569 13.6576 13 12.0007 13C10.3439 13 9.00073 11.6569 9.00073 10C9.00073 8.3431 10.3439 7 12.0007 7C13.6576 7 15.0007 8.3431 15.0007 10Z" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M12.0012 3C7.52354 3 3.73326 5.94288 2.45898 10C3.73324 14.0571 7.52354 17 12.0012 17C16.4788 17 20.2691 14.0571 21.5434 10C20.2691 5.94291 16.4788 3 12.0012 3Z" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>'
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
      .${CLASSES.btn} { all: unset; box-sizing: border-box; }
      
      .${CLASSES.wrapper} { 
        position: relative; 
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 4px; 
        z-index: 999999999 !important;
        isolation: isolate;
        transform: translateZ(0);
      }

      .${CLASSES.fab} {
        position: relative;
        width: 36px; height: 36px; border-radius: 18px; cursor: pointer;
        background: linear-gradient(135deg, #0DA30D 0%, #51D071 100%);
        color: #fff; display: flex; align-items: center; justify-content: center;
        box-shadow: 0 2px 12px rgba(13,163,13,0.14);
        transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        z-index: 999999999 !important;
        isolation: isolate;
        transform: translateZ(0);
      }
      .${CLASSES.fab}:hover { 
        box-shadow: 0 4px 16px rgba(13,163,13,0.2); 
        transform: translateZ(0) scale(1.05);
      }
      .${CLASSES.child} {
        position: fixed; 
        width: 40px; height: 40px; border-radius: 20px;
        background: #333; color: #fff; display: flex;
        align-items: center; justify-content: center; cursor: pointer;
        transform: scale(0.3) translateZ(0);
        transform-origin: center; opacity: 0;
        transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.15s ease-out;
        pointer-events: none;
        z-index: 999999999 !important;
        isolation: isolate;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        position: relative;
      }
      .${CLASSES.child}:hover { 
        background: #444; 
        transform: scale(1.1) translateZ(0) !important; 
      }
      .${CLASSES.child}.enhance {
        background: linear-gradient(135deg, #0DA30D 0%, #51D071 100%);
      }
      .${CLASSES.child}.enhance:hover {
        background: linear-gradient(135deg, #51D071 0%, #0DA30D 100%);
        transform: scale(1.15) translateZ(0) !important;
      }
      .${CLASSES.child}.construction {
        background: linear-gradient(135deg, #FFA500 0%, #FF8C00 100%);
        cursor: not-allowed;
      }
      .${CLASSES.child}.construction:hover {
        background: linear-gradient(135deg, #FFB347 0%, #FF8C00 100%);
        transform: scale(1.05) translateZ(0) !important;
      }
      .${CLASSES.child}.settings {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
      .${CLASSES.child}.settings:hover {
        background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
        transform: scale(1.15) translateZ(0) !important;
      }
      
      /* Tooltip labels for buttons */
      .${CLASSES.child}::after {
        content: attr(data-label);
        position: absolute;
        right: 50px;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s ease;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      .${CLASSES.child}:hover::after {
        opacity: 1;
      }
      
      .${CLASSES.banner} {
        position: fixed; 
        top: 20px; 
        left: 50%; 
        transform: translateX(-50%) translateY(-100px); 
        background: linear-gradient(135deg, #0DA30D 0%, #51D071 100%);
        color: white; 
        padding: 16px 24px; 
        border-radius: 12px;
        font-size: 15px; 
        font-weight: 600; 
        z-index: 999999999 !important;
        box-shadow: 0 8px 32px rgba(0,0,0,0.15);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.1);
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        isolation: isolate;
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .${CLASSES.banner}.visible { transform: translateX(-50%) translateY(0); }
      .${CLASSES.banner}.success { 
        background: linear-gradient(135deg, #0DA30D 0%, #51D071 100%);
        border-color: rgba(81, 208, 113, 0.3);
      }
      .${CLASSES.banner}.error { 
        background: linear-gradient(135deg, #dc3545 0%, #ff4757 100%);
        border-color: rgba(255, 71, 87, 0.3);
      }
      .${CLASSES.banner}.warn { 
        background: linear-gradient(135deg, #ffc107 0%, #ffb700 100%);
        color: #333;
        border-color: rgba(255, 183, 0, 0.3);
      }
      .${CLASSES.banner}.info { 
        background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
        border-color: rgba(0, 123, 255, 0.3);
      }
      .${CLASSES.banner}.construction { 
        background: linear-gradient(135deg, #FFA500 0%, #FF8C00 100%);
        border-color: rgba(255, 165, 0, 0.3);
      }
      .${CLASSES.banner}.review {
        background: rgba(24,24,27,0.90);
        border: 1px solid #3f3f46;
        backdrop-filter: blur(8px);
      }
      
      .${CLASSES.toast} {
        position: fixed; top: 24px; right: 24px; padding: 12px 16px; border-radius: 8px;
        font-size: 14px; font-weight: 500; color: white; 
        z-index: 999999998 !important;
        transform: translateX(120%) translateZ(0); opacity: 0;
        transition: transform 0.3s ease, opacity 0.3s ease;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        isolation: isolate;
      }
      .${CLASSES.toast}.visible { transform: translateX(0) translateZ(0); opacity: 1; }
      .${CLASSES.toast}.success { background: #0DA30D; }
      .${CLASSES.toast}.error { background: #dc3545; }
      .${CLASSES.toast}.warn { background: #ffc107; color: #333; }
      .${CLASSES.toast}.info { background: #007bff; }
      
      /* Ensure our elements are always on top of ChatGPT elements */
      .${CLASSES.wrapper}, .${CLASSES.fab}, .${CLASSES.child} {
        position: relative !important;
        z-index: 999999999 !important;
        isolation: isolate !important;
        transform-style: preserve-3d !important;
      }
      
      /* Override any conflicting ChatGPT styles */
      [data-testid*="composer"] .${CLASSES.wrapper},
      [class*="composer"] .${CLASSES.wrapper},
      [class*="textarea"] .${CLASSES.wrapper} {
        z-index: 999999999 !important;
        isolation: isolate !important;
      }

      /* Ensure textarea can scroll when maxed out */
      textarea.prompto-preview {
        resize: none !important;
        overflow-y: hidden; /* toggled to auto when needed */
        line-height: 1.4;
      }

      [contenteditable="true"].prompto-preview {
        resize: none !important;
        overflow-y: hidden;
        line-height: 1.4;
      }
    `;
    document.head.appendChild(style);

    const svgDefs = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgDefs.style.position = 'absolute';
    svgDefs.style.width = '0';
    svgDefs.style.height = '0';
    svgDefs.innerHTML = `<defs><linearGradient id="prompto-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0DA3D0"/><stop offset="100%" stop-color="#51D071"/></linearGradient></defs>`;
    document.body.appendChild(svgDefs);
  }

  function findAnchor() {
    return safeExecute(() => {
      // Priority 1: Microphone/voice input button (preferred)
      const micButton = safeQuerySelector('button[aria-label*="voice"], button[aria-label*="микрофон"], button[data-testid*="voice"], button[data-testid*="microphone"]');
      if (micButton?.isConnected) {
        const rect = micButton.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          const style = getComputedStyle(micButton);
          if (style.visibility !== 'hidden' && style.display !== 'none') {
            return { element: micButton, position: 'after' };
          }
        }
      }

      // Priority 2: Send button when mic not found
      const textarea = safeQuerySelector('textarea');
      if (textarea?.isConnected) {
        const composer = textarea.closest('form') || textarea.parentElement;
        if (composer?.isConnected) {
          const sendBtn = safeQuerySelector('button[type="submit"], button[data-testid="send-button"]', composer);
          if (sendBtn?.isConnected) {
            const rect = sendBtn.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
              return { element: sendBtn, position: 'before' };
            }
          }
          return { element: composer, position: 'before' };
        }
      }

      // Priority 3: Send-button container fallback
      const sendButtonContainer = safeQuerySelector('[data-testid="send-button"]')?.parentElement;
      if (sendButtonContainer?.isConnected) {
        const el = sendButtonContainer.children[0] || sendButtonContainer;
        if (el?.isConnected) {
          const rect = el.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            return { element: el, position: 'before' };
          }
        }
      }

      // Priority 4: Plain send-button fallback
      const sendButton = safeQuerySelector('[data-testid="send-button"]');
      if (sendButton?.isConnected) {
        const rect = sendButton.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          return { element: sendButton, position: 'before' };
        }
      }

      // Priority 5: Any composer-area button (last one -> rightmost)
      const composerButtons = safeQuerySelectorAll('[data-testid*="composer"] button, [class*="composer"] button')
        .filter(btn => btn?.isConnected);
      if (composerButtons.length) {
        return { element: composerButtons[composerButtons.length - 1], position: 'after' };
      }

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
      
      child.style.cssText = `
        position: fixed !important; 
        z-index: 999999999 !important; 
        isolation: isolate !important;
        transform-style: preserve-3d !important;
        transform: scale(0.3) translateZ(0) !important;
        opacity: 0 !important;
        pointer-events: none !important;
      `;
      
      if (document.body?.isConnected) {
        document.body.appendChild(child);
        positionChild(child, fab, index);
        
        requestAnimationFrame(() => {
          if (child?.isConnected) {
            child.style.transform = `scale(1) translateZ(0)`;
            child.style.opacity = '1';
            child.style.pointerEvents = 'auto';
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
        display: flex !important;
        align-items: center !important;
        margin: 0 4px !important;
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
      `;

      wrapper.appendChild(fab);

      try {
        if (position === 'after') {
          parent.insertBefore(wrapper, anchor.nextSibling);
        } else {
          parent.insertBefore(wrapper, anchor);
        }
        
        console.log('🚀 Prompto: FAB mounted successfully');
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

    // Enhance Prompt Button – green with sparkles
    createChild(
      fab,
      1,
      ICONS.sparkles,
      'Enhance Prompt with Advanced Techniques',
      () => enhancePrompt(getCurrentPromptElement()),
      'enhance',
      'Enhance Prompt'
    );

    // Token Optimizer Button – orange construction placeholder
    createChild(
      fab,
      2,
      ICONS.construction,
      'Token Optimizer (Under Construction)',
      () => showBanner('🚧 Token Optimizer is under construction! Coming soon with advanced compression algorithms.', 'construction', ICONS.construction),
      'construction',
      'Token Optimizer'
    );

    // Advanced Settings Button – blue settings icon
    createChild(
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
    
    // Ensure children are positioned correctly after creation
    setTimeout(() => updateChildPositions(), 50);
    
    document.addEventListener('click', function closeOnClickAway(e) {
      // Check if click is on fab or any child button
      const isClickOnFab = fab.contains(e.target);
      const isClickOnChild = e.target.closest(`.${CLASSES.child}`);
      
      if (!isClickOnFab && !isClickOnChild) {
        toggleSpeedDial(fab);
      }
    }, { capture: true, once: true });
  }

  function closeSpeedDial(fab) {
    // Find all child buttons (now attached to body)
    document.querySelectorAll(`.${CLASSES.child}`).forEach(child => {
      child.style.transform = 'scale(0.3) translateZ(0)';
      child.style.opacity = '0';
      child.style.pointerEvents = 'none';
      setTimeout(() => child.remove(), 300);
    });
  }

  function toggleSpeedDial(fab) {
    const isOpen = fab.dataset.open === '1';
    fab.dataset.open = isOpen ? '0' : '1';
    fab.innerHTML = isOpen ? ICONS.plus : ICONS.minus;
    fab.style.transform = isOpen ? 'translateZ(0) rotate(0deg)' : 'translateZ(0) rotate(45deg)';
    if (isOpen) closeSpeedDial(fab);
    else openSpeedDial(fab);
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

