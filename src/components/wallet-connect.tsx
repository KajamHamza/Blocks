
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useWallet, WalletType } from '@/hooks/useWallet';
import { Wallet, Loader2 } from 'lucide-react';

interface WalletOption {
  id: WalletType;
  name: string;
  icon: React.ReactNode;
}

interface WalletConnectProps {
  className?: string;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ className }) => {
  const { connect, status } = useWallet();
  const [connectingWallet, setConnectingWallet] = useState<WalletType | null>(null);

  const walletOptions: WalletOption[] = [
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 35 33" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M32.9583 1L19.8242 10.7183L22.2215 5.11667L32.9583 1Z" fill="#E17726" stroke="#E17726" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2.66699 1L15.6948 10.809L13.4003 5.11667L2.66699 1Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M28.2292 23.5245L24.7492 28.8147L32.2655 30.8629L34.4168 23.6538L28.2292 23.5245Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M1.21558 23.6538L3.35808 30.8629L10.8657 28.8147L7.39434 23.5245L1.21558 23.6538Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10.4632 14.5149L8.40381 17.6507L15.8451 17.9761L15.6021 9.98291L10.4632 14.5149Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M25.1618 14.515L19.9395 9.89185L19.8242 17.9761L27.2656 17.6507L25.1618 14.515Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10.8657 28.8148L15.3676 26.6371L11.5045 23.7032L10.8657 28.8148Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M20.2573 26.6371L24.7493 28.8148L24.1204 23.7032L20.2573 26.6371Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 'coinbase',
      name: 'Coinbase',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="1024" height="1024" fill="#0052FF"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M152 512C152 710.823 313.177 872 512 872C710.823 872 872 710.823 872 512C872 313.177 710.823 152 512 152C313.177 152 152 313.177 152 512ZM420 396C406.745 396 396 406.745 396 420V604C396 617.255 406.745 628 420 628H604C617.255 628 628 617.255 628 604V420C628 406.745 617.255 396 604 396H420Z" fill="white"/>
        </svg>
      )
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M256 64C150.13 64 64 150.13 64 256C64 361.87 150.13 448 256 448C361.87 448 448 361.87 448 256C448 150.13 361.87 64 256 64Z" fill="#3B99FC"/>
          <path d="M169.83 170.12C206.88 134.33 267.11 134.33 304.17 170.12L309.08 174.85C311.45 177.13 311.45 180.85 309.08 183.13L294.17 197.47C293 198.61 291.08 198.61 289.91 197.47L283.38 191.16C258.11 166.81 215.89 166.81 190.62 191.16L183.56 197.96C182.39 199.09 180.47 199.09 179.3 197.96L164.39 183.61C162.01 181.33 162.01 177.61 164.39 175.33L169.83 170.12ZM329.62 195.11L342.9 207.87C345.28 210.15 345.28 213.87 342.9 216.15L278.46 278.51C277.29 279.65 275.38 279.65 274.2 278.51L231.3 237.24C230.72 236.67 229.81 236.67 229.23 237.24L186.32 278.51C185.15 279.65 183.23 279.65 182.06 278.51L117.1 216.15C114.72 213.87 114.72 210.15 117.1 207.87L130.38 195.11C132.76 192.83 136.55 192.83 138.93 195.11L181.84 236.38C182.42 236.95 183.33 236.95 183.91 236.38L226.81 195.11C227.99 193.97 229.9 193.97 231.07 195.11L273.98 236.38C274.56 236.95 275.46 236.95 276.05 236.38L318.95 195.11C321.45 192.83 325.23 192.83 327.61 195.11H329.62Z" fill="white"/>
        </svg>
      )
    }
  ];

  const handleConnectWallet = async (walletId: WalletType) => {
    setConnectingWallet(walletId);
    const success = await connect(walletId);
    if (!success) {
      setConnectingWallet(null);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {walletOptions.map((wallet) => (
        <Button
          key={wallet.id}
          onClick={() => handleConnectWallet(wallet.id)}
          disabled={connectingWallet !== null}
          className={cn(
            "w-full flex items-center justify-center space-x-3 py-6 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl transition-all duration-300",
            "focus:ring-2 focus:ring-blocks-primary focus:ring-offset-2 focus:ring-offset-gray-900"
          )}
        >
          {connectingWallet === wallet.id ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <span className="flex-shrink-0">{wallet.icon}</span>
          )}
          <span className="font-medium text-white">
            {connectingWallet === wallet.id ? 'Connecting...' : wallet.name}
          </span>
        </Button>
      ))}
    </div>
  );
};

export default WalletConnect;
