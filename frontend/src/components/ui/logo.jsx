import React from 'react';

const Logo = ({ 
  variant = 'black', // 'black' or 'white'
  size = 'md', // 'sm', 'md', 'lg', 'xl'
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-6 w-auto',
    md: 'h-8 w-auto',
    lg: 'h-12 w-auto',
    xl: 'h-16 w-auto'
  };

  const logoSource = variant === 'white' ? '/prompto-logo-white.svg' : '/prompto-logo-black.svg';

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={logoSource} 
        alt="Prompto Logo" 
        title="Prompto Logo"
        className={sizeClasses[size]}
      />
    </div>
  );
};

export default Logo; 