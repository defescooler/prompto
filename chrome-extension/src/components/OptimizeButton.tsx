import React from 'react';

interface OptimizeButtonProps {
  onClick: () => void;
  disabled?: boolean;
  delay?: number;
}

const OptimizeButton: React.FC<OptimizeButtonProps> = ({
  onClick,
  disabled = false,
  delay = 0
}) => {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <button
      className="prompto-action-button prompto-optimize-button"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      aria-label="Optimize prompt tokens"
      title="Optimize prompt to reduce token usage"
      tabIndex={0}
      style={{ 
        animationDelay: `${delay}ms`,
        '--animation-delay': `${delay}ms`
      } as React.CSSProperties}
    >
      <span className="prompto-button-icon">💰</span>
      <span className="prompto-button-text">Optimize</span>
    </button>
  );
};

export default OptimizeButton;

