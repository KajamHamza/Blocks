import { lensClient, createSessionClient, getSessionClient } from './lens-client';
import { currentSession, fetchAuthenticatedSessions } from '@lens-protocol/client/actions';

/**
 * Generate an authentication challenge for the specified address
 */
export const generateChallenge = async (address: string) => {
  try {
    // Use the onboardingUser method which is compatible with Lens v2
    const challenge = await lensClient.challenge({
      onboardingUser: {
        wallet: address,
      },
    });
    console.log('Generated challenge:', challenge);
    return challenge;
  } catch (error) {
    console.error('Error generating challenge:', error);
    throw error;
  }
};

/**
 * Authenticate a user with their signature
 */
export const authenticate = async (address: string, signature: string, challengeId: string) => {
  try {
    console.log('Authenticating with:', { address, challengeId });
    const sessionClient = await createSessionClient(
      address, 
      signature,
      challengeId
    );
    return sessionClient;
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
};

/**
 * Check if the user has an active session
 */
export const checkSession = async () => {
  try {
    const sessionClient = await getSessionClient();
    if (!sessionClient) {
      return false;
    }

    const result = await currentSession(sessionClient);
    return result.isOk();
  } catch (error) {
    console.error('Error checking session:', error);
    return false;
  }
};

/**
 * Get the current session details
 */
export const getCurrentSession = async () => {
  try {
    const sessionClient = await getSessionClient();
    if (!sessionClient) {
      return null;
    }

    const result = await currentSession(sessionClient);
    if (result.isErr()) {
      return null;
    }
    return result.value;
  } catch (error) {
    console.error('Error getting current session:', error);
    return null;
  }
};

/**
 * List all authenticated sessions
 */
export const listSessions = async () => {
  try {
    const sessionClient = await getSessionClient();
    if (!sessionClient) {
      return [];
    }

    const result = await fetchAuthenticatedSessions(sessionClient);
    if (result.isErr()) {
      return [];
    }
    return result.value.items;
  } catch (error) {
    console.error('Error listing sessions:', error);
    return [];
  }
};

/**
 * Log out the current user
 */
export const logout = async () => {
  try {
    // Clear the session from storage
    window.localStorage.removeItem('lens-session');
    return true;
  } catch (error) {
    console.error('Error logging out:', error);
    return false;
  }
};

/**
 * Resume a session from storage
 */
export const resumeSession = async () => {
  try {
    const sessionClient = await getSessionClient();
    if (!sessionClient) {
      return null;
    }

    const result = await currentSession(sessionClient);
    if (result.isErr()) {
      return null;
    }
    return result.value;
  } catch (error) {
    console.error('Error resuming session:', error);
    return null;
  }
};
