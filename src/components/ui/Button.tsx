import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-kinpaku-gold disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    primary: "bg-kinpaku-gold text-white hover:bg-kinpaku-deep",
    secondary: "border border-kinpaku-gold text-kinpaku-gold hover:bg-kinpaku-gold hover:text-white",
    ghost: "hover:bg-graphite hover:text-kinpaku-gold text-text-warm"
  };
  
  const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 py-2",
    lg: "h-12 px-8 text-lg"
  };
  
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />
  );
}
