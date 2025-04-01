
import React, { useState } from 'react';
import { Heart, MessageCircle, Repeat, Share, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useWallet } from '@/hooks/useWallet';
import { usePost } from '@/hooks/usePost';
import { toast } from '@/hooks/use-toast';
import { AwardType } from '@/types/post';

interface PostActionsProps {
  postId: string;
  likes: number;
  comments: number;
  reposts: number;
  liked?: boolean;
  onActionComplete?: () => void;
}

const PostActions: React.FC<PostActionsProps> = ({
  postId,
  likes: initialLikes = 0,
  comments = 0,
  reposts = 0,
  liked: initialLiked = false,
  onActionComplete,
}) => {
  const { likePost, dislikePost, bookmarkPost, tipUser } = usePost();
  const { walletInfo, connect, status } = useWallet();
  const [isLiked, setIsLiked] = useState<boolean>(initialLiked);
  const [likeCount, setLikeCount] = useState<number>(initialLikes);
  const [isProcessingAction, setIsProcessingAction] = useState<boolean>(false);
  
  // Helper function to handle wallet connection if needed
  const ensureWalletConnected = async () => {
    if (!walletInfo && status !== 'connecting') {
      toast({
        title: "Connecting Wallet",
        description: "Please approve the connection request in your wallet",
      });
      
      // Try to connect with MetaMask by default
      const connected = await connect('metamask');
      
      if (!connected) {
        toast({
          title: "Authentication Required",
          description: "Please connect your wallet to interact with posts",
          variant: "destructive",
        });
        return false;
      }
      return true;
    }
    return !!walletInfo; // Return true if wallet is connected
  };

  const handleLikePost = async () => {
    // Enhanced validation and debugging
    if (!postId) {
      console.error('PostActions: No postId provided for like action', { postId });
      toast({
        title: "Error",
        description: "Could not identify the post",
        variant: "destructive",
      });
      return;
    }
    
    console.log('PostActions: Attempting like action with postId:', postId);
    
    // Check wallet connection
    if (!(await ensureWalletConnected())) {
      return;
    }
    
    try {
      setIsProcessingAction(true);
      
      if (isLiked) {
        // If already liked, dislike it
        console.log(`Disliking post with ID: ${postId}`);
        await dislikePost(postId);
        setIsLiked(false);
        setLikeCount(prev => Math.max(0, prev - 1));
      } else {
        // If not liked, like it
        console.log(`Liking post with ID: ${postId}`);
        await likePost(postId);
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
      }
      
      if (onActionComplete) {
        onActionComplete();
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
    if (!postId) {
      console.error('PostActions: No postId provided for repost action', { postId });
      toast({
        title: "Error",
        description: "Could not identify the post",
        variant: "destructive",
      });
      return;
    }
    
    // Check wallet connection
    if (!(await ensureWalletConnected())) {
      return;
    }
    
    try {
      console.log(`Attempting to repost post with ID: ${postId}`);
      toast({
        title: "Coming Soon",
        description: "Repost functionality will be available soon",
      });
    } catch (error) {
      console.error('Repost action failed:', error);
    }
  };
  
  const handleComment = async () => {
    if (!postId) {
      console.error('PostActions: No postId provided for comment action', { postId });
      toast({
        title: "Error",
        description: "Could not identify the post",
        variant: "destructive",
      });
      return;
    }
    
    // Check wallet connection
    if (!(await ensureWalletConnected())) {
      return;
    }
    
    try {
      console.log(`Attempting to comment on post with ID: ${postId}`);
      toast({
        title: "Coming Soon",
        description: "Comment functionality will be available soon",
      });
    } catch (error) {
      console.error('Comment action failed:', error);
    }
  };
  
  const handleBookmarkPost = async () => {
    if (!postId) {
      console.error('PostActions: No postId provided for bookmark action', { postId });
      toast({
        title: "Error",
        description: "Could not identify the post",
        variant: "destructive",
      });
      return;
    }
    
    // Check wallet connection
    if (!(await ensureWalletConnected())) {
      return;
    }
    
    try {
      setIsProcessingAction(true);
      console.log(`Bookmarking post with ID: ${postId}`);
      await bookmarkPost(postId);
      
      toast({
        title: "Success",
        description: "Post added to your bookmarks",
      });
      
      if (onActionComplete) {
        onActionComplete();
      }
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
    if (!postId) {
      console.error('PostActions: No postId provided for tip action', { postId });
      toast({
        title: "Error",
        description: "Could not identify the post",
        variant: "destructive",
      });
      return;
    }
    
    // Check wallet connection
    if (!(await ensureWalletConnected())) {
      return;
    }
    
    try {
      setIsProcessingAction(true);
      console.log(`Tipping post with ID: ${postId}`);
      await tipUser(postId, 0.1); // Default tip amount
      
      toast({
        title: "Tip Sent",
        description: "You successfully tipped 0.1 MATIC",
      });
      
      if (onActionComplete) {
        onActionComplete();
      }
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

  return (
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
  );
};

export default PostActions;
