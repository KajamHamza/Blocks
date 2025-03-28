
import React, { useState } from 'react';
import { Heart, MessageCircle, Repeat, Share, MoreHorizontal, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LensPost } from '@/services/lens-protocol';
import { useProfile } from '@/hooks/useProfile';
import { usePost } from '@/hooks/usePost';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { useWallet } from '@/hooks/useWallet';
import { toast } from '@/hooks/use-toast';

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
  post?: LensPost; // Optional post prop for compatibility
  postId?: string; // For identifying specific posts
}

const PostCard: React.FC<PostCardProps | { post: LensPost; className?: string }> = (props) => {
  const { getProfileByAddress, allProfiles } = useProfile();
  const { likePost: like, dislikePost, bookmarkPost, tipUser } = usePost();
  const { walletInfo } = useWallet();
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [isProcessingAction, setIsProcessingAction] = useState<boolean>(false);
  
  // If post prop is provided, extract data from it
  if ('post' in props) {
    const { post, className } = props;
    
    // Try to get author profile from profiles cache
    const authorProfile = allProfiles[post.authorAddress];
    
    // Use profile data if available, otherwise fallback to address
    const username = authorProfile?.username || post.authorAddress.slice(0, 6) + '...' + post.authorAddress.slice(-4);
    const handle = authorProfile?.username || post.authorAddress.slice(0, 6).toLowerCase();
    const avatarUrl = authorProfile?.profilePicture;
    
    // Map LensPost properties to PostCardProps
    return (
      <PostCard
        username={username}
        handle={handle}
        avatarUrl={avatarUrl}
        content={post.content}
        imageUrl={post.imageUrl}
        timestamp={new Date(post.createdAt).toLocaleDateString()}
        likes={post.likes || 0}
        comments={post.comments || 0}
        reposts={post.reposts || 0}
        userCreditRating={post.userCreditRating || 0}
        award={post.award || null}
        liked={post.likes ? post.likes > 0 : false}
        className={className}
        postId={post.id}
      />
    );
  }

  // Regular props usage
  const {
    username,
    handle,
    avatarUrl,
    content,
    imageUrl,
    timestamp,
    likes,
    comments,
    reposts,
    userCreditRating,
    award,
    liked = false,
    className,
    postId,
  } = props;

  // Initialize state values from props
  React.useEffect(() => {
    setIsLiked(liked);
    setLikeCount(likes);
  }, [liked, likes]);

  const handleLikePost = async () => {
    if (!postId || !walletInfo) {
      toast({
        title: "Authentication Required",
        description: "Please connect your wallet to interact with posts",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsProcessingAction(true);
      
      if (isLiked) {
        // If already liked, dislike it
        await dislikePost(postId);
        setIsLiked(false);
        setLikeCount(prev => Math.max(0, prev - 1));
      } else {
        // If not liked, like it
        await like(postId);
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Like action failed:', error);
      toast({
        title: "Action Failed",
        description: "Could not process your interaction",
        variant: "destructive",
      });
    } finally {
      setIsProcessingAction(false);
    }
  };
  
  const handleRepost = async () => {
    if (!postId || !walletInfo) {
      toast({
        title: "Authentication Required",
        description: "Please connect your wallet to repost content",
        variant: "destructive",
      });
      return;
    }
    
    try {
      toast({
        title: "Coming Soon",
        description: "Repost functionality will be available soon",
      });
    } catch (error) {
      console.error('Repost action failed:', error);
    }
  };
  
  const handleComment = async () => {
    if (!postId || !walletInfo) {
      toast({
        title: "Authentication Required",
        description: "Please connect your wallet to comment",
        variant: "destructive",
      });
      return;
    }
    
    try {
      toast({
        title: "Coming Soon",
        description: "Comment functionality will be available soon",
      });
    } catch (error) {
      console.error('Comment action failed:', error);
    }
  };
  
  const handleBookmarkPost = async () => {
    if (!postId || !walletInfo) {
      toast({
        title: "Authentication Required",
        description: "Please connect your wallet to bookmark posts",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsProcessingAction(true);
      await bookmarkPost(postId);
      
      toast({
        title: "Success",
        description: "Post added to your bookmarks",
      });
    } catch (error) {
      console.error('Bookmark action failed:', error);
      toast({
        title: "Action Failed",
        description: "Could not bookmark this post",
        variant: "destructive",
      });
    } finally {
      setIsProcessingAction(false);
    }
  };
  
  const handleTipUser = async () => {
    if (!postId || !walletInfo) {
      toast({
        title: "Authentication Required",
        description: "Please connect your wallet to tip creators",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsProcessingAction(true);
      await tipUser(postId, 0.1); // Default tip amount
      
      toast({
        title: "Tip Sent",
        description: "You successfully tipped 0.1 MATIC",
      });
    } catch (error) {
      console.error('Tip action failed:', error);
      toast({
        title: "Action Failed",
        description: "Could not process your tip",
        variant: "destructive",
      });
    } finally {
      setIsProcessingAction(false);
    }
  };

  const getAwardBadge = (award: AwardType) => {
    if (!award) return null;
    
    const badgeColors: Record<Exclude<AwardType, null>, string> = {
      bronze: 'bg-amber-700',
      silver: 'bg-gray-400',
      gold: 'bg-yellow-500',
      platinum: 'bg-indigo-300',
      diamond: 'bg-blue-300',
      ace: 'bg-purple-500',
      conqueror: 'bg-gradient-to-r from-red-500 to-purple-500',
    };
    
    return (
      <span className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white",
        badgeColors[award]
      )}>
        {award.charAt(0).toUpperCase() + award.slice(1)}
      </span>
    );
  };
  
  const getCreditRatingColor = (rating: number) => {
    if (rating >= 1) return 'text-green-500';
    if (rating >= 0.5) return 'text-blue-500';
    if (rating >= 0) return 'text-gray-400';
    if (rating >= -0.05) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className={cn("border-b border-gray-800/30 p-4 hover:bg-gray-900/30 transition-colors", className)}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <Avatar className="w-10 h-10 bg-gray-800">
            {avatarUrl ? (
              <AvatarImage 
                src={avatarUrl} 
                alt={username} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <AvatarFallback className="bg-gray-800 text-gray-400">
                <User size={16} />
              </AvatarFallback>
            )}
          </Avatar>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="font-bold text-white text-sm">{username}</span>
              <span className="ml-1.5 text-gray-500 text-xs">@{handle}</span>
              <span className="mx-1 text-gray-500 text-xs">·</span>
              <span className="text-gray-500 text-xs">{timestamp}</span>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 hover:text-white hover:bg-gray-800/50 rounded-full">
              <MoreHorizontal size={14} />
            </Button>
          </div>
          
          <div className="flex items-center gap-2 mt-1">
            <span className={cn("text-xs font-medium", getCreditRatingColor(userCreditRating))}>
              UCR: {userCreditRating.toFixed(2)}
            </span>
            {award && getAwardBadge(award)}
          </div>
          
          <div className="mt-2 text-white">
            <p className="whitespace-pre-line text-sm">{content}</p>
          </div>
          
          {imageUrl && (
            <div className="mt-3 rounded-lg overflow-hidden">
              <img 
                src={imageUrl} 
                alt="Post attachment" 
                className="w-full h-auto object-cover max-h-80"
                loading="lazy"
              />
            </div>
          )}
          
          <div className="mt-3 flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-500 hover:text-blocks-primary hover:bg-blocks-primary/10 rounded-full flex items-center gap-1 h-8 p-2"
              onClick={handleComment}
              disabled={isProcessingAction || !walletInfo}
            >
              <MessageCircle size={16} />
              <span className="text-xs">{comments > 0 ? comments : ''}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-500 hover:text-green-500 hover:bg-green-500/10 rounded-full flex items-center gap-1 h-8 p-2"
              onClick={handleRepost}
              disabled={isProcessingAction || !walletInfo}
            >
              <Repeat size={16} />
              <span className="text-xs">{reposts > 0 ? reposts : ''}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                "hover:bg-red-500/10 rounded-full flex items-center gap-1 h-8 p-2",
                isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
              )}
              onClick={handleLikePost}
              disabled={isProcessingAction}
            >
              <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
              <span className="text-xs">{likeCount > 0 ? likeCount : ''}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-500 hover:text-blocks-primary hover:bg-blocks-primary/10 rounded-full h-8 p-2"
              onClick={handleBookmarkPost}
              disabled={isProcessingAction || !walletInfo}
            >
              <Share size={16} />
            </Button>

            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-500 hover:text-yellow-500 hover:bg-yellow-500/10 rounded-full flex items-center gap-1 h-8 p-2"
              onClick={handleTipUser}
              disabled={isProcessingAction || !walletInfo}
            >
              <DollarSign size={16} />
              <span className="text-xs">Tip</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
