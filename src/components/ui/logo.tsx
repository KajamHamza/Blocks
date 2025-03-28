
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  className, 
  size = 'md',
  animated = false 
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24',
  };
  
  return (
    <div className={cn(
      'relative flex items-center justify-center',
      sizeClasses[size],
      animated && 'animate-pulse',
      className
    )}>
      <div className="absolute inset-0 bg-gradient-to-tr from-blocks-primary to-purple-500 rounded-lg blur opacity-75"></div>
      <div className="relative flex items-center justify-center bg-black rounded-lg w-full h-full border border-blocks-primary/50">
        <span className="font-display font-bold text-white text-xl">B</span>
      </div>
    </div>
  );
};

export default Logo;
