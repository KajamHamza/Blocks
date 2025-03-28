
import React from 'react';
import Logo from './ui/logo';
import WalletConnect from './wallet-connect';
import { cn } from '@/lib/utils';

interface LandingPageProps {
  className?: string;
}

const LandingPage: React.FC<LandingPageProps> = ({ className }) => {
  return (
    <div className={cn("min-h-screen flex flex-col md:flex-row", className)}>
      {/* Left side: Branding */}
      <div className="w-full md:w-1/2 bg-black flex flex-col items-center justify-center p-8 md:p-16">
        <div className="max-w-md text-center md:text-left space-y-8">
          <div className="flex justify-center md:justify-start">
            <Logo size="xl" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white leading-tight">
            <span className="text-gradient">Blocks</span>
            <span className="block mt-2">Decentralized Social.</span>
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl">
            Create, connect, and earn in a truly decentralized social experience on the Polygon network.
          </p>
          
          <div className="mt-6 flex justify-center md:justify-start">
            <div className="flex items-center gap-2 bg-purple-900/30 rounded-full py-1.5 px-4 border border-purple-700/30">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
              <span className="text-purple-300 text-sm">Powered by Polygon</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side: Connect wallet */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-gray-900 to-black p-8 md:p-16 flex items-center justify-center">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-display font-bold text-white">Join Us Today</h2>
            <p className="mt-2 text-gray-400">Connect your wallet to get started</p>
          </div>
          
          <div className="mt-8 space-y-4">
            <WalletConnect />
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              By connecting, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
