
import React, { useState, useEffect } from 'react';
import LoadingScreen from '@/components/loading-screen';
import LandingPage from '@/components/landing-page';
import MainLayout from '@/components/main-layout';
import Feed from '@/components/feed';
import ProfileSetup from '@/components/profile-setup';
import { useWallet } from '@/hooks/useWallet';
import { useProfile } from '@/hooks/useProfile';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { status } = useWallet();
  const { currentProfile, isLoading: profileLoading } = useProfile();
  
  useEffect(() => {
    // Check if this is the first app load
    const hasAppLoaded = sessionStorage.getItem('app_loaded');
    
    if (!hasAppLoaded) {
      // First load of the app - show loading screen
      const timer = setTimeout(() => {
        setIsLoading(false);
        // Mark that app has been loaded
        sessionStorage.setItem('app_loaded', 'true');
      }, 2000);
      
      return () => clearTimeout(timer);
    } else {
      // App has already loaded - skip loading screen
      setIsLoading(false);
    }
  }, []);

  if (isLoading || profileLoading) {
    return <LoadingScreen />;
  }
  
  if (status !== 'connected') {
    return <LandingPage />;
  }
  
  // Wallet is connected but user has no profile
  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center p-4 overlay-noise">
        <div className="w-full max-w-md">
          <ProfileSetup />
        </div>
      </div>
    );
  }
  
  // User is fully onboarded with a wallet and profile
  return (
    <MainLayout>
      <Feed />
    </MainLayout>
  );
};

export default Index;
