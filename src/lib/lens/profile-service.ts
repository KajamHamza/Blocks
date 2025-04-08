import { lensClient } from './lens-client';
import type { Account } from '@lens-protocol/client';
import { createAccountWithUsername, fetchAccount, fetchAccountsBulk } from '@lens-protocol/client/actions';

/**
 * Fetch profiles owned by a wallet address
 */
export const fetchProfilesByAddress = async (address: string): Promise<Account[]> => {
  try {
    console.log('Fetching profiles for address:', address);
    const profiles = await fetchAccountsBulk(lensClient, {
      addresses: [address],
    });
    console.log('Profiles retrieved:', profiles);
    return profiles.isOk() ? profiles.value : [];
  } catch (error) {
    console.error('Error fetching profiles by address:', error);
    throw error;
  }
};

/**
 * Fetch a profile by its ID or handle
 */
export const fetchProfileByIdOrHandle = async (handleOrId: string): Promise<Account | null> => {
  try {
    console.log('Fetching profile for:', handleOrId);
    let profile;
    
    if (handleOrId.startsWith('0x')) {
      // Try to fetch by profile ID first
      profile = await fetchAccount(lensClient, {
        legacyProfileId: handleOrId,
      });
      
      if (!profile) {
        // If no profile found by ID, try fetching by wallet address
        const profiles = await fetchAccountsBulk(lensClient, {
          addresses: [handleOrId],
        });
        
      }
      console.log('Profile found:', profile);
      return profile || null;
    } 
    } catch (error) {
    console.error('Error fetching profile by ID or handle:', error);
    return null;
  }
};