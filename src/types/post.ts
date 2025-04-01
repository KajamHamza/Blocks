
export type AwardType = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'ace' | 'conqueror' | null;

export interface PostCardProps {
  username: string;
  handle: string;
  avatarUrl?: string;
  content: string;
  imageUrl?: string;
  timestamp: string;
  likes: number;
  comments: number;
  reposts: number;
  userCreditRating: number;
  award: AwardType;
  liked?: boolean;
  className?: string;
  postId: string; // Make this required to fix the post identification issue
}
