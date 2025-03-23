import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`
          px-4 py-2 
          rounded-md 
          font-medium 
          bg-primary 
          text-white 
          disabled:opacity-50 
          disabled:cursor-not-allowed 
          hover:bg-primary-dark 
          transition-colors
          ${className}
        `}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
