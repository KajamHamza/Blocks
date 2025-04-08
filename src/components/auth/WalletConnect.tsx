
import React from 'react';
import { Button } from '@/components/ui/button';
import { useWalletConnection } from '@/hooks/use-wallet-connection';
import { Loader2 } from 'lucide-react';
import { WalletType } from '@/lib/wallet-services';
import { toast } from 'sonner';

interface WalletConnectProps {
  onSuccess?: () => void;
}

const WalletConnect = ({ onSuccess }: WalletConnectProps) => {
  const { connect, isConnecting } = useWalletConnection();
  
  const handleConnect = async (walletType: WalletType) => {
    try {
      await connect(walletType);
      toast.success(`Connected with ${walletType}`);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Connection failed:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-xs">
      <Button 
        size="lg" 
        className="bg-[#F6851B] hover:bg-[#E2761B] text-white"
        onClick={() => handleConnect('metamask')}
        disabled={isConnecting}
      >
        {isConnecting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <img src="/metamask.svg" alt="MetaMask" className="mr-2 h-5 w-5" />
        )}
        Connect with MetaMask
      </Button>
      
      <Button 
        size="lg" 
        className="bg-[#3375BB] hover:bg-[#2A5E94] text-white"
        onClick={() => handleConnect('coinbase')}
        disabled={isConnecting}
      >
        {isConnecting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <img src="/coinbase.svg" alt="Coinbase Wallet" className="mr-2 h-5 w-5" />
        )}
        Connect with Coinbase
      </Button>
      
      <Button 
        size="lg" 
        className="bg-[#3B99FC] hover:bg-[#2E7ED3] text-white"
        onClick={() => handleConnect('walletconnect')}
        disabled={isConnecting}
      >
        {isConnecting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <img src="/walletconnect.svg" alt="WalletConnect" className="mr-2 h-5 w-5" />
        )}
        Connect with WalletConnect
      </Button>
    </div>
  );
};

export default WalletConnect;
