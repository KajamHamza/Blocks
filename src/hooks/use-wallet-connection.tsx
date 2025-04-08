/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import type { Account } from '@lens-protocol/client';
import { connectWallet, disconnectWallet, WalletType } from '@/lib/wallet-services';
import { 
  generateChallenge, 
  authenticate, 
  checkSession,
  logout as logoutFromLens,
  getCurrentSession,
  resumeSession,
} from '@/lib/lens/auth-service';
import { lensClient, getSessionClient } from '@/lib/lens/lens-client';
import { createAccountWithUsername, fetchAccount } from '@lens-protocol/client/actions';
import { handleOperationWith } from '@lens-protocol/client/viem';
import { account } from '@lens-protocol/metadata';
import { uploadJson } from '@/lib/lens/storage-client';
import { uri, never } from '@lens-protocol/client';
import { createWalletClient, custom } from 'viem';
import { polygon, polygonAmoy } from 'viem/chains';
import { chains } from '@lens-chain/sdk/viem';
import { gql } from '@apollo/client';

interface WalletState {
  address: string | null;
  isConnecting: boolean;
  isConnected: boolean;
  isAuthenticated: boolean;
  lensProfile: Account | null;
  connect: (walletType: WalletType) => Promise<void>;
  disconnect: () => void;
  createLensProfile: (username: string, bio: string, avatar?: string, cover?: string) => Promise<Account | null>;
  isSessionActive: boolean;
}

const WalletConnectionContext = createContext<WalletState>({
  address: null,
  isConnecting: false,
  isConnected: false,
  isAuthenticated: false,
  lensProfile: null,
  connect: async () => {},
  disconnect: () => {},
  createLensProfile: async () => null,
  isSessionActive: false,
});

export const WalletConnectionProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lensProfile, setLensProfile] = useState<Account | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);

  // Check for wallet connection and session on mount
  useEffect(() => {
    const initializeConnection = async () => {
      try {
        if (window.ethereum && window.ethereum.request) {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            const currentAddress = accounts[0];
            setAddress(currentAddress);
            setIsConnected(true);
            
            // Try to resume existing session
            const session = await resumeSession();
            if (session) {
              setIsSessionActive(true);
              setIsAuthenticated(true);
              await loadUserProfiles(currentAddress);
            }
          }
        }
      } catch (error) {
        console.error('Error initializing connection:', error);
      }
    };
    
    initializeConnection();
  }, []);

  const loadUserProfiles = async (walletAddress: string) => {
    try {
      console.log('Loading user profiles for address:', walletAddress);
      
      // Check if we have a created Lens account info saved
      const savedLensAccountInfo = sessionStorage.getItem('createdLensAccountInfo');
      let savedLensAccountAddress = null;
      
      if (savedLensAccountInfo) {
        const parsedInfo = JSON.parse(savedLensAccountInfo);
        savedLensAccountAddress = parsedInfo.address;
        console.log('Found created Lens account address:', savedLensAccountAddress);
      }
      
      const sessionClient = await getSessionClient();
      if (!sessionClient) {
        console.error('No active session found in loadUserProfiles');
        return null;
      }
      
      // First try with the saved Lens account address if available
      if (savedLensAccountAddress) {
        console.log('Trying to fetch profile with saved Lens account address...');
        try {
          const savedResult = await fetchAccount(sessionClient, {
            address: savedLensAccountAddress,
          });
          
          if (savedResult.isOk()) {
            console.log('Profile found with saved Lens account address:', savedResult.value);
            const activeProfile = savedResult.value;
            setLensProfile(activeProfile);
            setIsAuthenticated(true);
            return activeProfile;
          }
        } catch (error) {
          console.error('Failed to fetch with saved address:', error);
        }
      }
      
      // If saved address didn't work, try querying for profiles owned by wallet
      try {
        console.log('Querying for profiles owned by wallet:', walletAddress);
        // Use Lens API to find profiles owned by this wallet
        const profiles = await fetchProfilesByOwner(sessionClient, walletAddress);
        
        if (profiles && profiles.length > 0) {
          console.log('Found profiles owned by wallet:', profiles);
          // Use the first profile (or you could let user select if multiple)
          const profileAddress = profiles[0].id;
          
          // Save this for future use
          const profileInfo = {
            address: profileAddress,
            username: profiles[0].handle || ''
          };
          sessionStorage.setItem('createdLensAccountInfo', JSON.stringify(profileInfo));
          
          // Now fetch the full profile with the correct address
          const result = await fetchAccount(sessionClient, {
            address: profileAddress,
          });
          
          if (result.isOk()) {
            const activeProfile = result.value;
            setLensProfile(activeProfile);
            setIsAuthenticated(true);
            return activeProfile;
          }
        }
      } catch (profileQueryError) {
        console.error('Failed to query profiles by owner:', profileQueryError);
      }
      
      // As a last resort, try with the wallet address directly
      try {
        const result = await fetchAccount(sessionClient, {
          address: walletAddress,
        });
  
        if (result.isOk()) {
          console.log('Profile found with wallet address:', result.value);
          const activeProfile = result.value;
          setLensProfile(activeProfile);
          setIsAuthenticated(true);
          return activeProfile;
        }
      } catch (directFetchError) {
        console.error('Failed to fetch with wallet address:', directFetchError);
      }
      
      // If we still don't have a profile, report failure
      console.log('No profile found for address:', walletAddress);
      return null;
    } catch (error) {
      console.error('Failed to fetch user profiles:', error);
      return null;
    }
  };
  
  // Helper function to query profiles owned by a wallet address
  async function fetchProfilesByOwner(sessionClient, walletAddress) {
    try {
      const { data } = await sessionClient.query({
        query: gql`
          query ProfilesOwnedBy($address: EthereumAddress!) {
            profilesManaged(request: { for: $address }) {
              items {
                id
                handle
                ownedBy
                metadata
              }
            }
          }
        `,
        variables: {
          address: walletAddress
        }
      });
      
      return data.profilesManaged.items;
    } catch (error) {
      console.error('Error fetching profiles by owner:', error);
      return [];
    }
  }

  const authenticateWithLens = async (address: string): Promise<boolean> => {
    try {
      const hasActiveSession = await checkSession();
      if (hasActiveSession) {
        setIsSessionActive(true);
        return true;
      }

      const challenge = await generateChallenge(address);
      if (!challenge.isOk()) {
        throw new Error('Failed to generate challenge');
      }

      console.log('Got challenge, requesting signature for ID:', challenge.value.id);

      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [challenge.value.text, address],
      });

      console.log('Signature:', signature);

      if (!signature) {
        throw new Error('Failed to get signature from wallet');
      }

      // Pass the challenge ID to authenticate
      await authenticate(address, signature, challenge.value.id);
      setIsSessionActive(true);
      return true;
    } catch (error) {
      console.error('Authentication failed:', error);
      return false;
    }
  };

  const connect = async (walletType: WalletType): Promise<void> => {
    setIsConnecting(true);
    
    try {
      const walletAddress = await connectWallet(walletType);
      setAddress(walletAddress);
      setIsConnected(true);
      
      toast.success('Wallet connected successfully');
      
      const isAuthenticated = await authenticateWithLens(walletAddress);
      if (!isAuthenticated) {
        toast.error('Failed to authenticate with Lens Protocol');
        return;
      }
      
      const hasProfile = await loadUserProfiles(walletAddress);
      if (!hasProfile) {
        console.log('No profile found for this wallet address');
      }
      
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast.error('Failed to connect wallet');
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  

  const createLensProfile = async (username: string, bio: string, avatar?: string, cover?: string) => {
    try {

      // At the top of the createLensProfile function, add username validation:
      if (username.length < 5) {
        throw new Error('Username must be at least 5 characters long');
      }

      if (!/^[a-z0-9_]+$/.test(username)) {
        throw new Error('Username can only contain lowercase letters, numbers, and underscores');
      }

      if (!address) {
        throw new Error('Wallet not connected');
      }
      
      console.log('Creating Lens profile, checking session...');
      console.log('Session active?', isSessionActive);
      
      if (!isSessionActive) {
        console.log('No active session, attempting to authenticate...');
        const isAuthenticated = await authenticateWithLens(address);
        if (!isAuthenticated) {
          throw new Error('Authentication required to create profile');
        }
      }
      
      toast.loading('Creating your Lens profile...');
      
      const sessionClient = await getSessionClient();
      if (!sessionClient) {
        console.error('Failed to get session client after authentication');
        throw new Error('No active session');
      }
      
      console.log('Got session client, creating profile metadata...');

      // Create and upload metadata
      const metadata = account({
        name: username,
        bio: bio,
        picture: avatar || undefined,
        coverPicture: cover || undefined,
      });

      console.log('Uploading metadata...');
      const metadataResult = await uploadJson(metadata);
      const metadataUri = metadataResult.uri;
      console.log('Metadata uploaded, URI:', metadataUri);

      // Create viem wallet client
      console.log('Creating wallet client...');

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[];

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found in wallet');
      }      

      const walletClient = createWalletClient({
        account: accounts[0] as `0x${string}`,
        chain: chains.testnet, // Use Polygon Amoy testnet
        transport: custom(window.ethereum as any)
      });
      
      console.log('Starting profile creation flow...');
      
      // Follow the exact flow from the docs
      const result = await createAccountWithUsername(sessionClient, {
        username: { localName: username },
        metadataUri: uri(metadataUri.uri),
      })
      .andThen(handleOperationWith(walletClient))
      .andThen(sessionClient.waitForTransaction)
      .andThen((txHash) => {
        console.log('Transaction complete, fetching account with txHash:', txHash);
        return fetchAccount(sessionClient, { txHash });
      })
      .andThen((account) => {
        console.log('Account fetched, switching to account:', account);
        if (!account) {
          throw new Error('Account not found after creation');
        }
        
        // Save crucial information about the created account
        const createdAccountInfo = {
          address: account.address,
          username: account.username?.localName || '',
        };
        
        // Store as JSON string to preserve object structure
        sessionStorage.setItem('createdLensAccountInfo', JSON.stringify(createdAccountInfo));
        
        // Store the newly created profile
        setLensProfile(account);
        setIsAuthenticated(true);
        
        // Save the created account address for lookups
        sessionStorage.setItem('createdLensAccountAddress', account.address);
        
        // Tell the app to use this account for future operations
        return sessionClient.switchAccount({
          account: account.address,
        });
      });
      
      if (result.isErr()) {
        console.error('Error creating profile:', result.error);
        const errorObj = result.error as Error;
        if (errorObj.message.includes('already taken')) {
          throw new Error('This username is already taken. Please choose another one.');
        } else if (errorObj.message.includes('rules')) {
          throw new Error('Profile creation failed: Not all rules satisfied. Username may be invalid or reserved.');
        } else {
          throw new Error(`Failed to create profile: ${errorObj.toString()}`);
        }
      }
      
      console.log('Profile created successfully, result:', result.value);
      
      // At this point, the profile should already be set via the andThen chain above
      // We'll just confirm the profile exists
      if (lensProfile) {
        toast.dismiss();
        toast.success('Profile created successfully!');
        
        // Navigate to the profile page after a short delay
        setTimeout(() => {
          if (lensProfile.username?.localName) {
            window.location.href = `/profile/${lensProfile.username.localName}`;
          } else {
            window.location.href = '/profile';
          }
        }, 1500);
        
        return lensProfile;
      }
      
      // As a fallback, try loading profile one more time
      // Use the saved account address if available
      const savedLensAccountAddress = sessionStorage.getItem('createdLensAccountAddress');
      const profileAddress = savedLensAccountAddress || address;
      
      console.log('Trying one more time with address:', profileAddress);
      const profile = await loadUserProfiles(profileAddress);
      
      if (profile) {
        toast.dismiss();
        toast.success('Profile created successfully!');
        return profile;
      }
      
      throw new Error('Profile creation in progress. It may take some time to appear on the blockchain.');
    } catch (error) {
      console.error('Failed to create Lens profile:', error);
      toast.dismiss();
      toast.error(error instanceof Error ? error.message : 'Failed to create profile');
      return null;
    }
  };

  const disconnect = () => {
    if (isSessionActive) {
      logoutFromLens()
        .then(() => console.log('Lens session revoked'))
        .catch(err => console.error('Error revoking Lens session:', err));
    }
    
    disconnectWallet();
    setAddress(null);
    setIsConnected(false);
    setIsAuthenticated(false);
    setLensProfile(null);
    setIsSessionActive(false);
    
    toast.info('Wallet disconnected');
    window.location.href = '/';
  };

  return (
    <WalletConnectionContext.Provider 
      value={{ 
        address, 
        isConnecting, 
        isConnected,
        isAuthenticated,
        lensProfile,
        connect, 
        disconnect,
        createLensProfile,
        isSessionActive
      }}
    >
      {children}
    </WalletConnectionContext.Provider>
  );
};

export const useWalletConnection = () => useContext(WalletConnectionContext);