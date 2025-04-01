
import { v4 as uuidv4 } from 'uuid';
import { LensPost } from './types';

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
  const profiles = JSON.parse(storedProfiles) as Record<string, any>;
  const authorProfile = profiles[authorAddress];
  
  // Mock response with a guaranteed unique ID
  const postId = uuidv4();
  console.log('Creating new post with ID:', postId);
  
  const post: LensPost = {
    id: postId,
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
  const posts = JSON.parse(storedPosts) as LensPost[];
  
  // Debug output
  console.log(`Retrieved ${posts.length} posts from storage`);
  posts.forEach(post => console.log(`Post ID: ${post.id}, Author: ${post.authorAddress.slice(0, 6)}...`));
  
  return posts;
};
