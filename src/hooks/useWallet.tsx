
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { toast } from '@/hooks/use-toast';

// Wallet types supported by the application
export type WalletType = 'metamask' | 'coinbase' | 'walletconnect';

// Wallet connection states
export type WalletStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

// Wallet interface
export interface WalletInfo {
  address: string;
  chain: string;
  balance: string;
}

// Context interface
interface WalletContextType {
  connect: (type: WalletType) => Promise<boolean>;
  disconnect: () => void;
  walletInfo: WalletInfo | null;
  status: WalletStatus;
  walletType: WalletType | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Helper functions for wallet providers
const isMetaMaskAvailable = (): boolean => {
  return typeof window !== 'undefined' && window.ethereum !== undefined && window.ethereum.isMetaMask === true;
};

const isCoinbaseWalletAvailable = (): boolean => {
  return typeof window !== 'undefined' && window.ethereum !== undefined && window.ethereum.isCoinbaseWallet === true;
};

// Lens Protocol parameters (running on Polygon)
const LENS_PROTOCOL_PARAMS = {
  chainId: '0x89', // 137 in decimal (Polygon)
  chainName: 'Lens Protocol (Polygon)',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18
  },
  rpcUrls: ['https://polygon-rpc.com/'],
  blockExplorerUrls: ['https://polygonscan.com/']
};

// Function to switch to Lens Protocol network
const switchToLensNetwork = async (): Promise<boolean> => {
  if (!window.ethereum) return false;
  
  try {
    // Try to switch to the Lens Protocol network (Polygon)
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: LENS_PROTOCOL_PARAMS.chainId }],
    });
    return true;
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [LENS_PROTOCOL_PARAMS],
        });
        return true;
      } catch (addError) {
        console.error('Error adding Lens Protocol network:', addError);
        return false;
      }
    }
    console.error('Error switching to Lens Protocol network:', switchError);
    return false;
  }
};

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [status, setStatus] = useState<WalletStatus>('disconnected');
  const [walletType, setWalletType] = useState<WalletType | null>(null);
  const initialized = useRef(false);

  // Restore wallet connection from localStorage - extracted as a callback to avoid infinite loops
  const restoreWalletConnection = useCallback(() => {
    const storedAuth = localStorage.getItem('blocks_auth');
    const storedWalletType = localStorage.getItem('blocks_wallet_type') as WalletType | null;
    const storedWalletInfo = localStorage.getItem('blocks_wallet_info');
    
    if (storedAuth && storedWalletType && storedWalletInfo && status === 'disconnected') {
      setWalletType(storedWalletType);
      setWalletInfo(JSON.parse(storedWalletInfo));
      setStatus('connected');
      
      // Dispatch a storage event to notify other parts of the app
      const event = new StorageEvent('storage', {
        key: 'blocks_wallet_info',
        newValue: storedWalletInfo
      });
      window.dispatchEvent(event);
    }
  }, [status]); // Only depends on status to prevent additional re-renders

  // Effect to check if a wallet is already connected on load
  useEffect(() => {
    // Prevent the effect from running more than once during initialization
    if (!initialized.current) {
      initialized.current = true;
      restoreWalletConnection();
    }
    
    // Setup event listener for account changes in MetaMask
    if (window.ethereum && typeof window.ethereum !== 'undefined') {
      // Since ethereum.on is not reliable in our type definition, we'll use a workaround
      // We'll check for account changes by polling
      const pollAccounts = setInterval(async () => {
        try {
          if (typeof window.ethereum.request === 'function') {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            const currentAddress = walletInfo?.address?.toLowerCase();
            
            // If we have a wallet connected but accounts are empty, disconnect
            if (currentAddress && (!accounts || accounts.length === 0)) {
              console.log('Wallet disconnected externally');
              disconnect();
            }
            // If account changed, update the connection
            else if (accounts && accounts.length > 0 && currentAddress && accounts[0].toLowerCase() !== currentAddress) {
              console.log('Account changed:', accounts[0]);
              // Update the wallet info without calling restoreWalletConnection to prevent infinite loops
              const updatedWalletInfo = {
                ...walletInfo,
                address: accounts[0]
              };
              setWalletInfo(updatedWalletInfo);
              
              // Update localStorage with new address
              localStorage.setItem('blocks_wallet_info', JSON.stringify(updatedWalletInfo));
            }
          }
        } catch (err) {
          console.error('Error polling accounts:', err);
        }
      }, 3000); // Poll every 3 seconds
      
      return () => clearInterval(pollAccounts);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletInfo?.address]); // Only depend on the address to prevent full re-renders

  // Connect to a wallet
  const connect = async (type: WalletType): Promise<boolean> => {
    try {
      setStatus('connecting');
      
      // Handle different wallet types
      if (type === 'metamask') {
        if (!isMetaMaskAvailable()) {
          window.open('https://metamask.io/download/', '_blank');
          toast({
            title: "MetaMask not installed",
            description: "Please install MetaMask and try again",
            variant: "destructive",
          });
          setStatus('disconnected');
          return false;
        }
        
        // Request account access
        try {
          if (window.ethereum) {
            // Switch to Lens Protocol network
            const networkSwitched = await switchToLensNetwork();
            if (!networkSwitched) {
              toast({
                title: "Network Switch Failed",
                description: "Failed to switch to Lens Protocol network. Please try again.",
                variant: "destructive",
              });
              setStatus('disconnected');
              return false;
            }
            
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            if (accounts && accounts.length > 0) {
              const address = accounts[0];
              const newWalletInfo = {
                address: address,
                chain: 'Lens Protocol',
                balance: '0.00' // In a real app, you would fetch the MATIC balance
              };
              
              setWalletInfo(newWalletInfo);
              setWalletType(type);
              setStatus('connected');
              
              // Store connection info
              localStorage.setItem('blocks_auth', 'true');
              localStorage.setItem('blocks_wallet_type', type);
              localStorage.setItem('blocks_wallet_info', JSON.stringify(newWalletInfo));
              
              toast({
                title: "Wallet Connected",
                description: "Successfully connected to MetaMask on Lens Protocol network",
              });
              
              return true;
            }
          }
        } catch (error) {
          console.error('MetaMask connection error:', error);
          toast({
            title: "Connection Failed",
            description: "Failed to connect to MetaMask. Please try again.",
            variant: "destructive",
          });
          setStatus('disconnected');
          return false;
        }
      } 
      else if (type === 'coinbase') {
        if (!isCoinbaseWalletAvailable()) {
          window.open('https://www.coinbase.com/wallet/downloads', '_blank');
          toast({
            title: "Coinbase Wallet not installed",
            description: "Please install Coinbase Wallet and try again",
            variant: "destructive",
          });
          setStatus('disconnected');
          return false;
        }
        
        // For demonstration purposes, we'll use a simulated connection
        // In a real app, you would use the Coinbase Wallet SDK and switch to Polygon
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockAddress = `0x${Array.from({length: 40}, () => 
          Math.floor(Math.random() * 16).toString(16)).join('')}`;
        
        const newWalletInfo = {
          address: mockAddress,
          chain: 'Polygon',
          balance: '0.00'
        };
        
        setWalletInfo(newWalletInfo);
        setWalletType(type);
        setStatus('connected');
        
        localStorage.setItem('blocks_auth', 'true');
        localStorage.setItem('blocks_wallet_type', type);
        localStorage.setItem('blocks_wallet_info', JSON.stringify(newWalletInfo));
        
        toast({
          title: "Wallet Connected",
          description: "Successfully connected to Coinbase Wallet on Polygon network",
        });
        
        return true;
      }
      else if (type === 'walletconnect') {
        // For demonstration, simulate WalletConnect
        // In a real app, you would use the WalletConnect SDK and switch to Polygon
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const mockAddress = `0x${Array.from({length: 40}, () => 
          Math.floor(Math.random() * 16).toString(16)).join('')}`;
        
        const newWalletInfo = {
          address: mockAddress,
          chain: 'Polygon',
          balance: '0.00'
        };
        
        setWalletInfo(newWalletInfo);
        setWalletType(type);
        setStatus('connected');
        
        localStorage.setItem('blocks_auth', 'true');
        localStorage.setItem('blocks_wallet_type', type);
        localStorage.setItem('blocks_wallet_info', JSON.stringify(newWalletInfo));
        
        toast({
          title: "Wallet Connected",
          description: "Successfully connected to WalletConnect on Polygon network",
        });
        
        return true;
      }
      
      // If we reach here, something went wrong
      setStatus('disconnected');
      return false;
    } catch (error) {
      console.error('Wallet connection error:', error);
      setStatus('error');
      setWalletType(null);
      
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
      
      return false;
    }
  };

  // Disconnect wallet
  const disconnect = () => {
    // Keep profile data in localStorage, but remove wallet connection
    localStorage.removeItem('blocks_auth');
    localStorage.removeItem('blocks_wallet_type');
    localStorage.removeItem('blocks_wallet_info');
    
    setWalletInfo(null);
    setWalletType(null);
    setStatus('disconnected');
    
    toast({
      title: "Wallet Disconnected",
      description: "You have been logged out",
    });
  };

  return (
    <WalletContext.Provider value={{ connect, disconnect, walletInfo, status, walletType }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
