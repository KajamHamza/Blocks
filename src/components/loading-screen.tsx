
import React, { useEffect, useState } from 'react';
import Logo from './ui/logo';

interface LoadingScreenProps {
  onLoadComplete?: () => void;
  duration?: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  onLoadComplete,
  duration = 2000
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if this is a page transition rather than initial load
    const isPageTransition = sessionStorage.getItem('app_loaded');
    
    if (isPageTransition) {
      // Skip loading animation for page transitions
      setIsLoading(false);
      onLoadComplete?.();
      return;
    }
    
    // This is initial load, show loading screen
    const timer = setTimeout(() => {
      setIsLoading(false);
      onLoadComplete?.();
      // Mark that app has been loaded
      sessionStorage.setItem('app_loaded', 'true');
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onLoadComplete]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-500">
      <div className="flex flex-col items-center">
        <Logo size="xl" animated={true} />
        <div className="mt-8 w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blocks-primary to-purple-500 rounded-full animate-pulse"
            style={{
              animationDuration: `${duration}ms`,
              width: '100%'
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
