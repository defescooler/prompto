import React, { useState, useEffect, useRef } from 'react';
import EnhanceButton from './EnhanceButton';
import OptimizeButton from './OptimizeButton';

interface ToolbarButtonProps {
  targetElement: HTMLElement;
  onEnhance: (element: HTMLElement) => void;
  onOptimize: (element: HTMLElement) => void;
  isLoading?: boolean;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  targetElement,
  onEnhance,
  onOptimize,
  isLoading = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({ bottom: 8, right: 8 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    updatePosition();
    
    const resizeObserver = new ResizeObserver(updatePosition);
    resizeObserver.observe(targetElement);
    
    // Handle clicks outside to close
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      resizeObserver.disconnect();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [targetElement]);

  const updatePosition = () => {
    const rect = targetElement.getBoundingClientRect();
    const parentRect = targetElement.parentElement?.getBoundingClientRect();
    
    if (parentRect) {
      setPosition({
        bottom: 8,
        right: 8
      });
    }
  };

  const handleMainButtonClick = () => {
    if (isLoading) return;
    setIsExpanded(!isExpanded);
  };

  const handleEnhance = () => {
    onEnhance(targetElement);
    setIsExpanded(false);
  };

  const handleOptimize = () => {
    onOptimize(targetElement);
    setIsExpanded(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsExpanded(false);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleMainButtonClick();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`prompto-toolbar ${isExpanded ? 'expanded' : ''}`}
      style={{
        position: 'absolute',
        bottom: position.bottom,
        right: position.right,
        pointerEvents: 'auto',
        zIndex: 10000
      }}
    >
      {/* Main trigger button */}
      <button
        className={`prompto-main-button ${isLoading ? 'loading' : ''}`}
        onClick={handleMainButtonClick}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        aria-label="Prompto AI Assistant"
        aria-expanded={isExpanded}
        title="Enhance or optimize your prompt"
        tabIndex={0}
      >
        {isLoading ? (
          <div className="prompto-spinner" />
        ) : (
          <span className="prompto-sparkle">✨</span>
        )}
      </button>

      {/* Action buttons */}
      <div className={`prompto-actions ${isExpanded ? 'visible' : ''}`}>
        <EnhanceButton
          onClick={handleEnhance}
          disabled={isLoading}
          delay={0}
        />
        <OptimizeButton
          onClick={handleOptimize}
          disabled={isLoading}
          delay={100}
        />
      </div>
    </div>
  );
};

export default ToolbarButton;

