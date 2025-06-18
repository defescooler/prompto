import React from 'react';

interface EnhanceButtonProps {
  onClick: () => void;
  disabled?: boolean;
  delay?: number;
}

const EnhanceButton: React.FC<EnhanceButtonProps> = ({
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
      className="prompto-action-button prompto-enhance-button"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      aria-label="Enhance prompt with AI"
      title="Enhance prompt with AI improvements"
      tabIndex={0}
      style={{ 
        animationDelay: `${delay}ms`,
        '--animation-delay': `${delay}ms`
      } as React.CSSProperties}
    >
      <span className="prompto-button-icon">⚡</span>
      <span className="prompto-button-text">Enhance</span>
    </button>
  );
};

export default EnhanceButton;

