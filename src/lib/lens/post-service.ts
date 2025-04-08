import { lensClient } from './lens-client';
//import { PublicationType } from '@lens-protocol/client';

/**
 * Fetch posts for the global feed
 */
export const fetchPosts = async (limit = 10) => {
  // try {
  //   const { items: publications } = await lensClient.publication.fetchAll({
  //     where: {
  //       publicationTypes: [PublicationType.Post],
  //     },
  //     limit: limit as any, // Cast to any since LimitType is not matching with number
  //   });
  //   return publications;
  // } catch (error) {
  //   console.error('Error fetching posts:', error);
  //   throw error;
  // }
  return [];
};

/**
 * Fetch posts from a specific profile
 */
export const fetchProfilePosts = async (profileId: string, limit = 10) => {
  // try {
  //   const { items: publications } = await lensClient.publication.fetchAll({
  //     where: {
  //       from: [profileId],
  //       publicationTypes: [PublicationType.Post],
  //     },
  //     limit: limit as any, // Cast to any since LimitType is not matching with number
  //   });
  //   return publications;
  // } catch (error) {
  //   console.error('Error fetching profile posts:', error);
  //   return [];
  // }
  return [];
};

/**
 * Create a new post on Lens Protocol
 */
export const createPost = async (profileId: string, content: string) => {
  // try {
  //   // Create metadata for the post
  //   const metadata = {
  //     version: '2.0.0',
  //     content,
  //     description: content.substring(0, 100),
  //     name: `Post by ${new Date().toISOString()}`,
  //     attributes: [],
  //     media: [],
  //     appId: 'blocks',
  //     // Use string literal instead of enum since PublicationMainFocus is not exported
  //     mainContentFocus: 'TEXT_ONLY',
  //   };
    
  //   // Log available methods to make sure we're using a valid one
  //   console.log('Available publication methods:', Object.keys(lensClient.publication));
    
  //   // Using an available method from lensClient.publication
  //   const result = await lensClient.publication.postOnChain({
  //     profileId,
  //     contentURI: `ipfs://${JSON.stringify(metadata)}`, // In a real app, we'd upload this to IPFS
  //   });
    
  //   return result;
  // } catch (error) {
  //   console.error('Error creating post:', error);
  //   throw error;
  // }
  return null;
};
