
import { LensPost, LensCollectModule } from './types';
import { v4 as uuidv4 } from 'uuid';

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
    console.error(`Post not found with ID: ${postId}`);
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
    console.error(`Post not found with ID: ${postId}`);
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
    console.error(`Post not found with ID: ${postId}`);
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
    console.error(`Post not found with ID: ${postId}`);
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
