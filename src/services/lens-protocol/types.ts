
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
