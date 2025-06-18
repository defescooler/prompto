import React, { useEffect, useState } from 'react';

interface SuggestionOverlayProps {
  original: string;
  suggestion: string;
  type: 'enhance' | 'optimize';
  onAccept: () => void;
  onDecline: () => void;
  onClose: () => void;
}

const SuggestionOverlay: React.FC<SuggestionOverlayProps> = ({
  original,
  suggestion,
  type,
  onAccept,
  onDecline,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDiff, setShowDiff] = useState(false);

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 10);

    // Handle keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        onAccept();
      } else if (e.key === 'Tab') {
        e.preventDefault();
        setShowDiff(!showDiff);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onAccept, showDiff]);

  const tokenSavings = type === 'optimize' ? 
    Math.max(0, original.length - suggestion.length) : 0;
  
  const improvement = type === 'enhance' ? 
    Math.max(0, suggestion.length - original.length) : 0;

  const renderDiff = () => {
    if (!showDiff) return null;
    
    // Simple diff highlighting
    const originalWords = original.split(' ');
    const suggestionWords = suggestion.split(' ');
    
    return (
      <div className="prompto-diff-view">
        <div className="prompto-diff-section">
          <h5>Removed</h5>
          <div className="prompto-diff-content prompto-diff-removed">
            {originalWords.filter(word => !suggestionWords.includes(word)).join(' ')}
          </div>
        </div>
        <div className="prompto-diff-section">
          <h5>Added</h5>
          <div className="prompto-diff-content prompto-diff-added">
            {suggestionWords.filter(word => !originalWords.includes(word)).join(' ')}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`prompto-suggestion-backdrop ${isVisible ? 'visible' : ''}`}>
      <div className="prompto-suggestion-modal">
        {/* Header */}
        <div className="prompto-suggestion-header">
          <div className="prompto-suggestion-title">
            <div className="prompto-logo">
              <svg width="24" height="24" viewBox="0 0 150 248" fill="none">
                <rect x="35" y="38" width="36" height="87" fill="#0DA30D"/>
                <rect x="74" y="33" width="36" height="90" fill="#0DA30D"/>
                <rect x="113" y="28" width="36" height="65" fill="#51D071"/>
                <rect x="106" y="95" width="50" height="43" fill="#0DA30D"/>
                <rect x="113" y="140" width="37" height="51" fill="#51D071"/>
                <rect x="75" y="114" width="35" height="89" fill="#0DA30D"/>
                <rect x="35" y="114" width="37" height="86" fill="#0DA30D"/>
              </svg>
            </div>
            <h3>
              {type === 'enhance' ? '⚡ Enhanced Prompt' : '💰 Optimized Prompt'}
            </h3>
          </div>
          <div className="prompto-header-actions">
            <button
              className="prompto-diff-toggle"
              onClick={() => setShowDiff(!showDiff)}
              title="Toggle diff view (Tab)"
            >
              {showDiff ? '📝' : '🔍'}
            </button>
            <button
              className="prompto-close-button"
              onClick={onClose}
              aria-label="Close suggestion"
              title="Close (Esc)"
            >
              ×
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="prompto-suggestion-stats">
          <div className="prompto-stat">
            <span className="prompto-stat-icon">📝</span>
            <div className="prompto-stat-content">
              <span className="prompto-stat-label">Original</span>
              <span className="prompto-stat-value">{original.length} chars</span>
            </div>
          </div>
          
          <div className="prompto-stat-arrow">→</div>
          
          <div className="prompto-stat">
            <span className="prompto-stat-icon">{type === 'enhance' ? '⚡' : '💰'}</span>
            <div className="prompto-stat-content">
              <span className="prompto-stat-label">Suggested</span>
              <span className="prompto-stat-value">{suggestion.length} chars</span>
            </div>
          </div>
          
          {(tokenSavings > 0 || improvement > 0) && (
            <>
              <div className="prompto-stat-arrow">→</div>
              <div className={`prompto-stat ${tokenSavings > 0 ? 'prompto-stat-savings' : 'prompto-stat-improvement'}`}>
                <span className="prompto-stat-icon">{tokenSavings > 0 ? '💾' : '📈'}</span>
                <div className="prompto-stat-content">
                  <span className="prompto-stat-label">
                    {tokenSavings > 0 ? 'Saved' : 'Enhanced'}
                  </span>
                  <span className="prompto-stat-value">
                    {tokenSavings > 0 ? `-${tokenSavings}` : `+${improvement}`} chars
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div className="prompto-suggestion-content">
          {showDiff ? renderDiff() : (
            <div className="prompto-comparison">
              <div className="prompto-comparison-section">
                <h4>Original</h4>
                <div className="prompto-text-preview prompto-text-original">
                  {original}
                </div>
              </div>
              
              <div className="prompto-comparison-arrow">
                <span>→</span>
              </div>
              
              <div className="prompto-comparison-section">
                <h4>Suggested</h4>
                <div className="prompto-text-preview prompto-text-suggestion">
                  {suggestion}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="prompto-suggestion-actions">
          <button
            className="prompto-suggestion-button prompto-decline-button"
            onClick={onDecline}
            title="Decline suggestion"
          >
            <span>Decline</span>
          </button>
          
          <div className="prompto-action-group">
            <button
              className="prompto-suggestion-button prompto-copy-button"
              onClick={() => {
                navigator.clipboard.writeText(suggestion);
                // Show brief feedback
                const btn = document.activeElement as HTMLButtonElement;
                const originalText = btn.textContent;
                btn.textContent = 'Copied!';
                setTimeout(() => {
                  btn.textContent = originalText;
                }, 1000);
              }}
              title="Copy to clipboard"
            >
              <span>📋 Copy</span>
            </button>
            
            <button
              className="prompto-suggestion-button prompto-accept-button"
              onClick={onAccept}
              title="Accept suggestion (Ctrl+Enter)"
            >
              <span>Accept</span>
              <kbd>⌘⏎</kbd>
            </button>
          </div>
        </div>

        {/* Keyboard shortcuts help */}
        <div className="prompto-shortcuts-hint">
          <span>💡 <kbd>Tab</kbd> toggle diff • <kbd>Esc</kbd> close • <kbd>⌘⏎</kbd> accept</span>
        </div>
      </div>
    </div>
  );
};

export default SuggestionOverlay;

