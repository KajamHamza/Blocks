
// This file contains the Lens Protocol API integration services
// In a production app, you would implement actual API calls to Lens Protocol here

/**
 * Lens Protocol API service
 * 
 * This is a mock implementation. In a real application, this would connect to
 * the actual Lens Protocol API with authentication and proper error handling.
 */

import { v4 as uuidv4 } from 'uuid';
import { SocialLinks } from '@/types/profile';

// Types for the Lens Protocol API
export interface LensPost {
  id: string;
  content: string;
  imageUrl?: string;
  createdAt: number;
  authorAddress: string;
  likes?: number;
  comments?: number;
  reposts?: number;
  netVotes?: number; // Likes minus dislikes
  collection?: string; // For bookmarks collections
  userCreditRating?: number; // User Credit Rating of the author
  award?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'ace' | 'conqueror' | null;
}

export interface LensProfile {
  id: string;
  handle: string; // This would be the username in Lens Protocol
  bio: string;
  avatar: string; // IPFS URI in real Lens Protocol
  address: string; // Owner wallet address
  createdAt: number;
  updatedAt: number;
  socialLinks?: SocialLinks;
  userCreditRating?: number; // User Credit Rating
}

// Lens Protocol Collect Module interface (for tipping)
export interface LensCollectModule {
  id: string;
  postId: string;
  recipientAddress: string;
  collectPrice: number; // Price in MATIC
  totalCollected: number; // Total amount collected
  collectorsCount: number; // Number of collectors
}

/**
 * Creates a profile on Lens Protocol
 * 
 * In a real application, this would connect to the Lens Protocol API to create a profile
 * The process typically involves:
 * 1. Requesting a signature from the user's wallet
 * 2. Submitting a transaction to the Lens Protocol smart contracts
 * 3. Waiting for confirmation on the blockchain
 * 
 * @param address The wallet address of the profile owner
 * @param handle The username/handle for the profile
 * @param bio The bio/description for the profile
 * @param avatar The profile picture (in a real app, this would be uploaded to IPFS)
 * @param socialLinks Optional social media links
 * @returns The created profile
 */
export const createProfile = async (
  address: string,
  handle: string,
  bio: string,
  avatar: File | null,
  socialLinks?: SocialLinks
): Promise<LensProfile> => {
  console.log('Creating profile on Lens Protocol:', { address, handle, bio, avatar, socialLinks });
  
  // Simulate API call delay and blockchain confirmation
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // In a real app, we'd upload the avatar to IPFS and get back an IPFS URI
  // Here we're mocking this by creating a data URL if an avatar is provided
  let avatarUrl = '';
  if (avatar) {
    // This is a mock - in a real app, we'd upload to IPFS and get an ipfs:// URI
    avatarUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(avatar);
    });
  }
  
  // Mock profile creation
  const profile: LensProfile = {
    id: uuidv4(),
    handle,
    bio,
    avatar: avatarUrl,
    address,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    socialLinks,
    userCreditRating: 0.01 // Default starting point for all users
  };
  
  // Store in local storage to simulate persistence
  const storedProfiles = localStorage.getItem('lens_profiles') || '{}';
  const profiles = JSON.parse(storedProfiles) as Record<string, LensProfile>;
  profiles[address] = profile;
  localStorage.setItem('lens_profiles', JSON.stringify(profiles));
  
  return profile;
};

/**
 * Checks if a handle is available on Lens Protocol
 * 
 * @param handle The handle to check
 * @returns True if the handle is available, false otherwise
 */
export const checkHandleAvailability = async (handle: string): Promise<boolean> => {
  console.log('Checking handle availability on Lens Protocol:', handle);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Check local storage for existing profiles
  const storedProfiles = localStorage.getItem('lens_profiles') || '{}';
  const profiles = JSON.parse(storedProfiles) as Record<string, LensProfile>;
  
  // Check if any existing profile has this handle
  return !Object.values(profiles).some(
    profile => profile.handle.toLowerCase() === handle.toLowerCase()
  );
};

/**
 * Gets a profile by address from Lens Protocol
 * 
 * @param address The wallet address to look up
 * @returns The profile if found, null otherwise
 */
export const getProfileByAddress = async (address: string): Promise<LensProfile | null> => {
  console.log('Getting profile by address from Lens Protocol:', address);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Get profiles from local storage
  const storedProfiles = localStorage.getItem('lens_profiles') || '{}';
  const profiles = JSON.parse(storedProfiles) as Record<string, LensProfile>;
  
  return profiles[address] || null;
};

/**
 * Creates a post on Lens Protocol
 * @param content The content of the post
 * @param imageUrl Optional URL of an image attached to the post
 * @param authorAddress The address of the post author
 * @returns The created post
 */
export const createPost = async (
  content: string,
  imageUrl: string | undefined,
  authorAddress: string
): Promise<LensPost> => {
  // This is a mock implementation
  // In a real app, this would call the Lens Protocol API
  
  console.log('Creating post on Lens Protocol:', { content, imageUrl, authorAddress });
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Get author's profile to include their UCR
  const storedProfiles = localStorage.getItem('lens_profiles') || '{}';
  const profiles = JSON.parse(storedProfiles) as Record<string, LensProfile>;
  const authorProfile = profiles[authorAddress];
  
  // Mock response
  const post: LensPost = {
    id: uuidv4(),
    content,
    imageUrl,
    createdAt: Date.now(),
    authorAddress,
    likes: 0,
    comments: 0,
    reposts: 0,
    netVotes: 0,
    userCreditRating: authorProfile?.userCreditRating || 0.01,
    award: null // New posts start with no award
  };
  
  // Store in local storage for persistence between sessions
  const storedPosts = localStorage.getItem('lens_posts') || '[]';
  const posts = JSON.parse(storedPosts) as LensPost[];
  posts.push(post);
  localStorage.setItem('lens_posts', JSON.stringify(posts));
  
  return post;
};

/**
 * Gets posts from Lens Protocol
 * @returns A list of posts
 */
export const getPosts = async (): Promise<LensPost[]> => {
  // This is a mock implementation
  // In a real app, this would call the Lens Protocol API
  
  console.log('Getting posts from Lens Protocol');
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Get posts from local storage
  const storedPosts = localStorage.getItem('lens_posts') || '[]';
  return JSON.parse(storedPosts) as LensPost[];
};

/**
 * Likes a post
 * @param postId The ID of the post to like
 * @param userAddress The address of the user liking the post
 * @returns The updated post
 */
export const likePost = async (postId: string, userAddress: string): Promise<LensPost> => {
  console.log('Liking post on Lens Protocol:', { postId, userAddress });
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Get posts from local storage
  const storedPosts = localStorage.getItem('lens_posts') || '[]';
  const posts = JSON.parse(storedPosts) as LensPost[];
  
  // Find the post to like
  const postIndex = posts.findIndex(post => post.id === postId);
  if (postIndex === -1) {
    throw new Error('Post not found');
  }
  
  // Update the post
  posts[postIndex].likes = (posts[postIndex].likes || 0) + 1;
  posts[postIndex].netVotes = (posts[postIndex].netVotes || 0) + 1;
  
  // Update award based on likes
  const likes = posts[postIndex].likes || 0;
  if (likes > 1000000) posts[postIndex].award = 'conqueror';
  else if (likes > 1000) posts[postIndex].award = 'ace';
  else if (likes > 500) posts[postIndex].award = 'diamond';
  else if (likes > 150) posts[postIndex].award = 'platinum';
  else if (likes > 50) posts[postIndex].award = 'gold';
  else if (likes > 20) posts[postIndex].award = 'silver';
  else if (likes > 5) posts[postIndex].award = 'bronze';
  
  // Store the updated posts
  localStorage.setItem('lens_posts', JSON.stringify(posts));
  
  return posts[postIndex];
};

/**
 * Dislikes a post (custom extension to Lens Protocol)
 * @param postId The ID of the post to dislike
 * @param userAddress The address of the user disliking the post
 * @returns The updated post
 */
export const dislikePost = async (postId: string, userAddress: string): Promise<LensPost> => {
  console.log('Disliking post (custom extension to Lens Protocol):', { postId, userAddress });
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Get posts from local storage
  const storedPosts = localStorage.getItem('lens_posts') || '[]';
  const posts = JSON.parse(storedPosts) as LensPost[];
  
  // Find the post to dislike
  const postIndex = posts.findIndex(post => post.id === postId);
  if (postIndex === -1) {
    throw new Error('Post not found');
  }
  
  // Update the post
  posts[postIndex].netVotes = (posts[postIndex].netVotes || 0) - 1;
  
  // Check if the post should enter the Kill Zone
  if ((posts[postIndex].netVotes || 0) < -2) {
    // In a real app, we'd update a flag in the smart contract
    // Here we're just simulating it
    console.log('Post entered the Kill Zone:', postId);
  }
  
  // Store the updated posts
  localStorage.setItem('lens_posts', JSON.stringify(posts));
  
  return posts[postIndex];
};

/**
 * Bookmarks a post (custom extension to Lens Protocol)
 * @param postId The ID of the post to bookmark
 * @param userAddress The address of the user bookmarking the post
 * @param collectionName Optional collection name to organize bookmarks
 * @returns Success boolean
 */
export const bookmarkPost = async (
  postId: string, 
  userAddress: string,
  collectionName: string = 'Favorites'
): Promise<boolean> => {
  console.log('Bookmarking post (custom extension to Lens Protocol):', { postId, userAddress, collectionName });
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Get posts from local storage
  const storedPosts = localStorage.getItem('lens_posts') || '[]';
  const posts = JSON.parse(storedPosts) as LensPost[];
  
  // Find the post to bookmark
  const post = posts.find(post => post.id === postId);
  if (!post) {
    throw new Error('Post not found');
  }
  
  // Get user's bookmarks
  const bookmarkKey = `bookmarks_${userAddress}`;
  const storedBookmarks = localStorage.getItem(bookmarkKey) || '[]';
  const bookmarks = JSON.parse(storedBookmarks) as LensPost[];
  
  // Add collection to the post
  const bookmarkPost = { ...post, collection: collectionName };
  
  // Add to bookmarks if not already there
  if (!bookmarks.some(bookmark => bookmark.id === postId)) {
    bookmarks.push(bookmarkPost);
    localStorage.setItem(bookmarkKey, JSON.stringify(bookmarks));
  }
  
  return true;
};

/**
 * Tip a user using MATIC via Lens Protocol Collect Module
 * @param postId The ID of the post to tip
 * @param senderAddress The address of the user sending the tip
 * @param amount The amount of MATIC to tip
 * @returns Success boolean
 */
export const tipUser = async (
  postId: string,
  senderAddress: string,
  amount: number
): Promise<boolean> => {
  console.log('Tipping user via Lens Protocol Collect Module:', { postId, senderAddress, amount });
  
  // Simulate API call delay and blockchain confirmation
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Get posts from local storage
  const storedPosts = localStorage.getItem('lens_posts') || '[]';
  const posts = JSON.parse(storedPosts) as LensPost[];
  
  // Find the post being tipped
  const post = posts.find(post => post.id === postId);
  if (!post) {
    throw new Error('Post not found');
  }
  
  // Get collect modules from local storage or initialize
  const collectKey = 'lens_collect_modules';
  const storedCollects = localStorage.getItem(collectKey) || '[]';
  const collectModules = JSON.parse(storedCollects) as LensCollectModule[];
  
  // Find existing collect module or create a new one
  let collectModule = collectModules.find(module => module.postId === postId);
  
  if (!collectModule) {
    collectModule = {
      id: uuidv4(),
      postId,
      recipientAddress: post.authorAddress,
      collectPrice: 0,
      totalCollected: 0,
      collectorsCount: 0
    };
    collectModules.push(collectModule);
  }
  
  // Update collect module with the new tip
  collectModule.totalCollected += amount;
  collectModule.collectorsCount += 1;
  
  // Save updated collect modules
  localStorage.setItem(collectKey, JSON.stringify(collectModules));
  
  // In a real app, this would trigger a blockchain transaction
  console.log(`Transaction completed: ${senderAddress} tipped ${amount} MATIC to ${post.authorAddress}`);
  
  return true;
};

/**
 * Gets a user's UCR (User Credit Rating)
 * @param userAddress The address of the user
 * @returns The user's UCR
 */
export const getUserCreditRating = async (userAddress: string): Promise<number> => {
  console.log('Getting UCR for user:', userAddress);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Get user's profile
  const storedProfiles = localStorage.getItem('lens_profiles') || '{}';
  const profiles = JSON.parse(storedProfiles) as Record<string, LensProfile>;
  
  return profiles[userAddress]?.userCreditRating || 0.01;
};

/**
 * Updates a user's UCR (User Credit Rating)
 * This would be done by the UCREngine contract in a real implementation
 * @param userAddress The address of the user
 * @param newRating The new UCR value
 * @returns Success boolean
 */
export const updateUserCreditRating = async (userAddress: string, newRating: number): Promise<boolean> => {
  console.log('Updating UCR for user:', { userAddress, newRating });
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Get user's profile
  const storedProfiles = localStorage.getItem('lens_profiles') || '{}';
  const profiles = JSON.parse(storedProfiles) as Record<string, LensProfile>;
  
  if (!profiles[userAddress]) {
    throw new Error('User profile not found');
  }
  
  // Update UCR
  profiles[userAddress].userCreditRating = newRating;
  profiles[userAddress].updatedAt = Date.now();
  
  // Store updated profiles
  localStorage.setItem('lens_profiles', JSON.stringify(profiles));
  
  return true;
};
