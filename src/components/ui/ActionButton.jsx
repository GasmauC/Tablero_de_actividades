import React from 'react';
import './ActionButton.css';

const ActionButton = ({ onClick, variant = 'primary', className = '', type = 'button', children }) => {
  return (
    <button 
      type={type} 
      className={`action-btn ${variant} ${className}`} 
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default ActionButton;
