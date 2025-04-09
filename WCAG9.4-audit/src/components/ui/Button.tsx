import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  rightIcon?: ReactNode;
  disabled?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = "",
  onClick,
  rightIcon,
  disabled = false
}: ButtonProps) {
  const baseStyle = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";
  
  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow",
    secondary: "bg-blue-100 text-blue-900 hover:bg-blue-200",
    outline: "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800",
    ghost: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
    link: "text-blue-600 dark:text-blue-400 underline-offset-4 hover:underline"
  };
  
  const sizeStyles = {
    sm: "text-xs px-2.5 py-1.5 rounded",
    md: "text-sm px-4 py-2 rounded-md",
    lg: "text-base px-6 py-3 rounded-md"
  };
  
  return (
    <button
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
}