import React from 'react';
import '../../styles/styles.css';

function Button({ 
  children, 
  variant = 'default', // default, primary, danger
  size = 'large',     // small, medium, large
  onClick, 
  className = '',
  ...props 
}) {
  const getButtonClass = () => {
    const baseClass = 'button';
    const variantClass = variant !== 'default' ? `button-${variant}` : '';
    const sizeClass = size !== 'medium' ? `button-${size}` : '';
    return `${baseClass} ${variantClass} ${sizeClass} ${className}`.trim();
  };

  return (
    <button 
      className={getButtonClass()}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;