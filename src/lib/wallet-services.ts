/* eslint-disable @typescript-eslint/no-explicit-any */

import { ethers } from 'ethers';

// Available wallet types
export type WalletType = 'metamask' | 'coinbase' | 'walletconnect';

// Check if MetaMask is available
export const isMetaMaskAvailable = (): boolean => {
  return typeof window !== 'undefined' && !!window.ethereum?.isMetaMask;
};

// Check if Coinbase Wallet is available
export const isCoinbaseWalletAvailable = (): boolean => {
  return typeof window !== 'undefined' && !!window.ethereum?.isCoinbaseWallet;
};

// Connect to wallet and return the address
export const connectWallet = async (walletType: WalletType): Promise<string> => {
  try {
    if (!window.ethereum) {
      throw new Error(`No wallet detected. Please install ${walletType}`);
    }

    let provider: ethers.BrowserProvider;
    
    switch (walletType) {
      case 'metamask':
        if (!isMetaMaskAvailable()) {
          // If MetaMask is not installed, redirect to installation page
          window.open('https://metamask.io/download/', '_blank');
          throw new Error('MetaMask is not installed. Please install it and refresh the page.');
        }
        // Force type assertion since we know the provider is valid
        provider = new ethers.BrowserProvider(window.ethereum as any);
        break;
      case 'coinbase':
        if (!isCoinbaseWalletAvailable()) {
          // If Coinbase Wallet is not installed, redirect to installation page
          window.open('https://www.coinbase.com/wallet', '_blank');
          throw new Error('Coinbase Wallet is not installed. Please install it and refresh the page.');
        }
        // Force type assertion since we know the provider is valid
        provider = new ethers.BrowserProvider(window.ethereum as any);
        break;
      case 'walletconnect':
        // For WalletConnect, we would need to implement the specific WalletConnect logic
        // This is a placeholder 
        throw new Error('WalletConnect implementation requires additional configuration. Please use MetaMask or Coinbase Wallet for now.');
      default:
        throw new Error('Unknown wallet type');
    }

    console.log('Requesting accounts...');
    
    // Request account access
    const accounts = await provider.send("eth_requestAccounts", []);
    const address = accounts[0];
    
    console.log('Connected with address:', address);

    return address;
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
};

// Disconnect wallet
export const disconnectWallet = async (): Promise<void> => {
  // In most wallet providers, disconnecting is handled by the wallet itself
  // This function is mostly to clean up the local state
  console.log('Disconnecting wallet...');
  return;
};

// Type definition for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      isCoinbaseWallet?: boolean;
      request?: (args: any) => Promise<any>;
    };
  }
}
