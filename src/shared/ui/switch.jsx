import React from "react";

const Switch = ({ checked, onCheckedChange, className = "", disabled = false }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={`
        relative inline-flex p-1 items-center h-5 w-16 shrink-0 rounded-full
        ${checked ? 'bg-yellow-400' : 'bg-gray-600'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        transition-colors duration-200 ease-in-out focus:outline-none
        ${className}
      `}
    >
      <span
        className={`
          pointer-events-none inline-block h-8 w-8 transform rounded-full bg-white
          transition-transform duration-200 ease-in-out
          ${checked ? 'translate-x-6' : 'translate-x-0'}
        `}
        style={{ 
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
        }}
      />
    </button>
  );
};

export { Switch }; 