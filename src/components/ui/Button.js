import React from 'react';

export const Button = ({ 
  children, 
  variant = 'default', 
  size = 'default', 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200'
  };
  
  const sizes = {
    default: 'h-10 py-2 px-4 text-sm',
    lg: 'h-12 py-3 px-6 text-base'
  };
  
  const styles = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <button className={styles} {...props}>
      {children}
    </button>
  );
};