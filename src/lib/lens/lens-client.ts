import '../polyfills';
import { PublicClient, testnet } from "@lens-protocol/client";
import { fragments } from './fragments';

// Initialize the public client with localStorage for session persistence
export const publicClient = PublicClient.create({
  environment: testnet,
  fragments,
  origin: window.location.origin,
  storage: window.localStorage
});

// Export the client
export const lensClient = publicClient;

// Keep track of the current session client
let currentSessionClient = null;

// Function to create a session client after authentication
export const createSessionClient = async (address: string, signature: string, challengeId: string) => {
  try {
    console.log('Creating session client with address:', address);
    console.log('Signature length:', signature.length);
    console.log('Challenge ID:', challengeId);

    // No longer generating a new challenge here, using the one passed in
    const result = await publicClient.authenticate({
      signature,
      id: challengeId,
    });

    if (result.isErr()) {
      console.error('Authentication error:', result.error);
      throw new Error(result.error.message);
    }

    console.log('Authentication successful, created session client');
    
    // Store the session client
    window.localStorage.setItem('lens-session', JSON.stringify({
      address,
      signature,
      id: challengeId
    }));

    // Save the current session client
    currentSessionClient = result.value;
    
    return result.value;
  } catch (error) {
    console.error('Failed to create session client:', error);
    throw error;
  }
};

// Function to get the current session client
export const getSessionClient = async () => {
  try {
    // If we already have a session client, return it
    if (currentSessionClient) {
      console.log('Returning cached session client');
      return currentSessionClient;
    }
    
    const sessionData = window.localStorage.getItem('lens-session');
    if (!sessionData) {
      console.log('No session data found in localStorage');
      return null;
    }

    console.log('Found session data in localStorage, trying to authenticate');
    
    const { address, signature, id } = JSON.parse(sessionData);
    const result = await publicClient.authenticate({
      id,
      signature,
    });

    if (result.isErr()) {
      console.error('Failed to authenticate with stored credentials:', result.error);
      window.localStorage.removeItem('lens-session');
      return null;
    }

    console.log('Successfully recreated session client from localStorage');
    
    // Save the current session client
    currentSessionClient = result.value;
    
    return result.value;
  } catch (error) {
    console.error('Failed to get session client:', error);
    window.localStorage.removeItem('lens-session');
    return null;
  }
};

// Clear the session client
export const clearSessionClient = () => {
  currentSessionClient = null;
  window.localStorage.removeItem('lens-session');
  console.log('Session client cleared');
};
