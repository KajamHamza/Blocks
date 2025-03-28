import React from 'react';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/hooks/useWallet';
import { useProfile } from '@/hooks/useProfile';
import { LogOut, Wallet, User } from 'lucide-react';
import { shortenAddress } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const AccountStatus: React.FC = () => {
  const { walletInfo, disconnect } = useWallet();
  const { currentProfile } = useProfile();
  
  if (!walletInfo) return null;
  
  return (
    <div className="flex items-center gap-4">
      <div className="rounded-lg bg-gray-800/50 border border-gray-700/50 py-1.5 px-3 flex items-center gap-2">
        {currentProfile ? (
          <>
            <Avatar className="h-6 w-6">
              {currentProfile.profilePicture ? (
                <AvatarImage src={currentProfile.profilePicture} alt={currentProfile.username} />
              ) : (
                <AvatarFallback className="bg-gray-700 text-white">
                  <User className="h-3 w-3" />
                </AvatarFallback>
              )}
            </Avatar>
            <span className="text-sm font-medium text-gray-300">
              {currentProfile.username}
            </span>
          </>
        ) : (
          <>
            <Wallet className="h-4 w-4 text-blocks-primary" />
            <span className="text-sm font-medium text-gray-300">
              {shortenAddress(walletInfo.address)}
            </span>
          </>
        )}
        <span className="text-xs px-1.5 py-0.5 rounded bg-purple-900/50 text-purple-300">
          {walletInfo.chain}
        </span>
      </div>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={disconnect}
        className="text-gray-400 hover:text-white bg-transparent hover:bg-gray-800/50"
      >
        <LogOut className="h-4 w-4" />
        <span className="sr-only">Log out</span>
      </Button>
    </div>
  );
};

export default AccountStatus;
