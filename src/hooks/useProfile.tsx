
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';
import { UserProfile, SocialLinks } from '@/types/profile';
import { 
  createProfile as lensCreateProfile, 
  getProfileByAddress, 
  checkHandleAvailability,
  LensProfile 
} from '@/services/lens-protocol';

interface ProfileContextType {
  currentProfile: UserProfile | null;
  allProfiles: Record<string, UserProfile>;
  isLoading: boolean;
  error: string | null;
  getProfileByAddress: (address: string) => Promise<UserProfile | null>;
  getProfileByUsername: (username: string) => UserProfile | null;
  createProfile: (address: string, username: string, bio: string, profilePicture: File | null, socialLinks: SocialLinks) => Promise<boolean>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<boolean>;
  checkUsernameAvailability: (username: string) => Promise<boolean>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// Helper function to convert Lens Profile to our UserProfile format
const convertLensProfileToUserProfile = (lensProfile: LensProfile): UserProfile => {
  return {
    address: lensProfile.address,
    username: lensProfile.handle,
    bio: lensProfile.bio,
    profilePicture: lensProfile.avatar,
    socialLinks: lensProfile.socialLinks || {},
    createdAt: lensProfile.createdAt,
    updatedAt: lensProfile.updatedAt,
  };
};

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<Record<string, UserProfile>>({});
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchedAddress, setLastFetchedAddress] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [fetchCounter, setFetchCounter] = useState(0); // Add counter to limit fetch attempts

  // Load profiles on mount
  useEffect(() => {
    setIsLoading(false);
    setIsInitialized(true);
  }, []);

  // Check if user has a profile when a wallet is connected - only run once on initialization
  useEffect(() => {
    // Prevent rapid re-fetching
    if (fetchCounter > 3) {
      console.log('Maximum fetch attempts reached, stopping profile checks');
      return;
    }
    
    const checkConnectedWallet = async () => {
      if (!isInitialized) return;
      
      const storedWalletInfo = localStorage.getItem('blocks_wallet_info');
      
      if (storedWalletInfo) {
        try {
          const walletInfo = JSON.parse(storedWalletInfo);
          const address = walletInfo.address;
          
          // Prevent repeated fetching of the same address
          if (address === lastFetchedAddress) {
            console.log('Skipping profile fetch for already loaded address:', address);
            return;
          }
          
          setIsLoading(true);
          setLastFetchedAddress(address);
          setFetchCounter(prev => prev + 1); // Increment fetch counter
          
          // Check if this wallet has a profile on Lens Protocol
          console.log('Getting profile by address from Lens Protocol:', address);
          const lensProfile = await getProfileByAddress(address);
          
          if (lensProfile) {
            const userProfile = convertLensProfileToUserProfile(lensProfile);
            setProfiles(prev => ({
              ...prev,
              [address]: userProfile
            }));
            setCurrentProfile(userProfile);
            console.log('Profile found for wallet:', address);
          } else {
            // Wallet connected but no profile yet
            setCurrentProfile(null);
            console.log('No profile found for wallet:', address);
          }
        } catch (err) {
          console.error('Failed to check profile for connected wallet:', err);
          setError('Failed to check profile');
        } finally {
          setIsLoading(false);
        }
      } else {
        // No wallet connected
        setCurrentProfile(null);
        setIsLoading(false);
        console.log('No wallet connected');
      }
    };

    checkConnectedWallet();
    
    // Properly add all dependencies to prevent infinite loops
  }, [isInitialized, lastFetchedAddress, fetchCounter]);

  // Listen for storage events to handle external wallet changes
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'blocks_wallet_info') {
        // Reset counter when wallet changes
        setFetchCounter(0);
        
        if (event.newValue) {
          try {
            const walletInfo = JSON.parse(event.newValue);
            const address = walletInfo.address;
            
            if (address !== lastFetchedAddress) {
              setLastFetchedAddress(null); // Reset to trigger a new fetch
            }
          } catch (err) {
            console.error('Error parsing wallet info from storage event:', err);
          }
        } else {
          // Wallet was disconnected
          setCurrentProfile(null);
          setLastFetchedAddress(null);
        }
      }
    };
    
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [lastFetchedAddress]);

  // Add polling for account changes but with proper throttling
  useEffect(() => {
    if (!window.ethereum || typeof window.ethereum !== 'undefined' && typeof window.ethereum.request !== 'function') {
      return;
    }
    
    let isPolling = false;
    
    const pollAccounts = async () => {
      // Prevent concurrent polling
      if (isPolling) return;
      
      try {
        isPolling = true;
        
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        const currentAddress = lastFetchedAddress?.toLowerCase();
        
        // If we have a wallet connected but accounts are empty, disconnect
        if (currentAddress && (!accounts || accounts.length === 0)) {
          console.log('Wallet disconnected externally');
          setCurrentProfile(null);
          setLastFetchedAddress(null);
          localStorage.removeItem('blocks_auth');
          localStorage.removeItem('blocks_wallet_type');
          localStorage.removeItem('blocks_wallet_info');
        }
        // If account changed, update the connection
        else if (accounts && accounts.length > 0 && currentAddress && accounts[0].toLowerCase() !== currentAddress) {
          console.log('Account changed:', accounts[0]);
          // Reset fetch counter and address to trigger a new fetch
          setFetchCounter(0);
          setLastFetchedAddress(null);
        }
      } catch (err) {
        console.error('Error polling accounts:', err);
      } finally {
        isPolling = false;
      }
    };
    
    // Poll less frequently to reduce load
    const timer = setInterval(pollAccounts, 5000); // Poll every 5 seconds instead of 3
    
    return () => clearInterval(timer);
  }, [lastFetchedAddress]);

  // The rest of the hook stays the same
  const getProfileByAddressImpl = async (address: string): Promise<UserProfile | null> => {
    try {
      if (profiles[address]) {
        return profiles[address];
      }
      
      const lensProfile = await getProfileByAddress(address);
      if (lensProfile) {
        const userProfile = convertLensProfileToUserProfile(lensProfile);
        setProfiles(prev => ({
          ...prev,
          [address]: userProfile
        }));
        return userProfile;
      }
      return null;
    } catch (err) {
      console.error('Failed to get profile by address:', err);
      return null;
    }
  };

  const getProfileByUsername = (username: string): UserProfile | null => {
    const found = Object.values(profiles).find(
      (profile) => profile.username.toLowerCase() === username.toLowerCase()
    );
    return found || null;
  };

  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    try {
      return await checkHandleAvailability(username);
    } catch (err) {
      console.error('Failed to check username availability:', err);
      return false;
    }
  };

  const createProfile = async (
    address: string,
    username: string,
    bio: string,
    profilePicture: File | null,
    socialLinks: SocialLinks
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Validate username
      const isAvailable = await checkUsernameAvailability(username);
      if (!isAvailable) {
        toast({
          title: "Username already taken",
          description: "Please choose a different username",
          variant: "destructive",
        });
        setIsLoading(false);
        return false;
      }

      // Create profile using Lens Protocol API
      const lensProfile = await lensCreateProfile(
        address,
        username,
        bio,
        profilePicture,
        socialLinks
      );
      
      // Convert to our UserProfile format
      const userProfile = convertLensProfileToUserProfile(lensProfile);
      
      // Update state
      setProfiles((prev) => ({
        ...prev,
        [address]: userProfile,
      }));
      
      setCurrentProfile(userProfile);
      
      toast({
        title: "Profile Created",
        description: "Your profile has been created successfully on Lens Protocol",
      });
      
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error('Failed to create profile:', err);
      toast({
        title: "Profile Creation Failed",
        description: "There was an error creating your profile on Lens Protocol",
        variant: "destructive",
      });
      setError('Failed to create profile');
      setIsLoading(false);
      return false;
    }
  };

  const updateProfile = async (profileData: Partial<UserProfile>): Promise<boolean> => {
    // This would call the Lens Protocol API to update a profile
    // For now, we'll leave this as a mock implementation
    try {
      if (!currentProfile) {
        toast({
          title: "No Profile Found",
          description: "You need to create a profile first",
          variant: "destructive",
        });
        return false;
      }

      setIsLoading(true);

      // Simulate profile update
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update profile
      const updatedProfile: UserProfile = {
        ...currentProfile,
        ...profileData,
        updatedAt: Date.now(),
      };

      // Update state
      setProfiles((prev) => ({
        ...prev,
        [currentProfile.address]: updatedProfile,
      }));
      
      setCurrentProfile(updatedProfile);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });
      
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error('Failed to update profile:', err);
      toast({
        title: "Profile Update Failed",
        description: "There was an error updating your profile",
        variant: "destructive",
      });
      setError('Failed to update profile');
      setIsLoading(false);
      return false;
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        currentProfile,
        allProfiles: profiles,
        isLoading,
        error,
        getProfileByAddress: getProfileByAddressImpl,
        getProfileByUsername,
        createProfile,
        updateProfile,
        checkUsernameAvailability,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
