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
    sparkles: '<svg viewBox="0 0 20 20" width="20" height="20"><path d="M10 2l1.09 3.41a1 1 0 00.95.69h3.58l-2.9 2.11a1 1 0 00-.36 1.12l1.09 3.41-2.9-2.11a1 1 0 00-1.18 0l-2.9 2.11 1.09-3.41a1 1 0 00-.36-1.12L4.38 6.1h3.58a1 1 0 00.95-.69L10 2z" fill="#fff"/></svg>',
    zap: '<svg viewBox="0 0 20 20" width="20" height="20"><path d="M10 2 4 12h5v6l6-10h-5V2z" fill="#fff"/></svg>',
    spinner: '<svg viewBox="0 0 20 20" width="20" height="20"><circle cx="10" cy="10" r="8" stroke="#fff" stroke-width="2" fill="none" stroke-dasharray="32" stroke-dashoffset="16"><animate attributeName="stroke-dashoffset" values="16;0;-16" dur="1s" repeatCount="indefinite"/></circle></svg>',
    construction: '<svg viewBox="0 0 36 36" width="20" height="20"><path fill="#FFCC4D" d="M36 15a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4h28a4 4 0 0 1 4 4v8z"></path><path d="M6 3H4a4 4 0 0 0-4 4v2l6-6zm6 0L0 15c0 1.36.682 2.558 1.72 3.28L17 3h-5zM7 19h5L28 3h-5zm16 0L35.892 6.108A3.995 3.995 0 0 0 33.64 3.36L18 19h5zm13-4v-3l-7 7h3a4 4 0 0 0 4-4z" fill="#292F33"></path><path fill="#99AAB5" d="M4 19h5v14H4zm23 0h5v14h-5z"></path></svg>',
    settings: '<svg viewBox="0 0 20 20" width="20" height="20"><path fill="#fff" d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fill="#fff" fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/></svg>'
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
        chrome.runtime.sendMessage({ action: 'openOptions' }, (response) => {
          if (chrome.runtime.lastError) {
            // Fallback: try to open options page directly
            if (chrome.runtime.openOptionsPage) {
              chrome.runtime.openOptionsPage();
            } else {
              showBanner('⚙️ Please access settings via the extension popup', 'info', ICONS.settings);
            }
          }
        });
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

