
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useWalletConnection } from '@/hooks/use-wallet-connection';
import WalletConnect from '@/components/auth/WalletConnect';
import ProfileSetup from '@/components/auth/ProfileSetup';

const Landing = () => {
  const { isConnected, isAuthenticated, lensProfile } = useWalletConnection();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  
  // Update local state based on context
  useEffect(() => {
    setIsWalletConnected(isConnected);
  }, [isConnected]);
  
  // If authenticated redirect to feed
  if (isAuthenticated && lensProfile) {
    return <Navigate to="/feed" replace />;
  }
  
  // If wallet is connected but not authenticated, show profile setup
  if (isConnected && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-blocks-background">
        <div className="flex min-h-screen">
          {/* Left side - Branding */}
          <div className="hidden md:flex md:w-1/3 bg-blocks-background items-center justify-center p-8 bg-[url('/lens-pattern.svg')] bg-cover bg-center">
            <div className="max-w-md w-full animate-fade-in">
              <div className="flex flex-col items-center">
                <img 
                  src="/logo.svg" 
                  alt="Blocks Logo" 
                  className="h-24 mb-6 animate-pulse-slow" 
                />
                <h1 className="text-4xl font-bold mb-3 text-white">
                  Welcome to <span className="text-gradient">Blocks</span>
                </h1>
                <p className="text-muted-foreground text-center">
                  Powered by <span className="text-blocks-accent">Lens Protocol</span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Right side - Profile Setup */}
          <div className="w-full md:w-2/3 bg-blocks-card flex flex-col items-center justify-center p-8">
            <ProfileSetup />
          </div>
        </div>
      </div>
    );
  }
  
  // Default: Show wallet connect options
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Branding */}
      <div className="md:w-1/2 bg-blocks-background flex items-center justify-center p-8">
        <div className="max-w-md w-full animate-fade-in">
          <div className="flex flex-col items-center">
            <img 
              src="/logo.svg" 
              alt="Blocks Logo" 
              className="h-24 mb-6 animate-pulse-slow" 
            />
            <h1 className="text-4xl font-bold mb-3 text-white">
              Welcome to <span className="text-gradient">Blocks</span>
            </h1>
            <p className="text-muted-foreground text-center mb-8">
              The decentralized social platform powered by Lens Protocol
            </p>
          </div>
        </div>
      </div>
      
      {/* Right side - Authentication */}
      <div className="md:w-1/2 bg-gradient-to-br from-blocks-card to-black flex flex-col items-center justify-center p-8">
        <div className="max-w-md w-full animate-scale-up">
          <h2 className="text-2xl font-semibold mb-2 text-center text-white">
            Connect Your Wallet
          </h2>
          <p className="text-muted-foreground text-center mb-8">
            Join the future of decentralized social media
          </p>
          
          <div className="flex justify-center">
            <WalletConnect onSuccess={() => setIsWalletConnected(true)} />
          </div>
          
          <p className="text-xs text-muted-foreground text-center mt-8">
            By connecting your wallet, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
