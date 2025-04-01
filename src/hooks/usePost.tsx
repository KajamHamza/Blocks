
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';
import { useWallet } from '@/hooks/useWallet';
import { useProfile } from '@/hooks/useProfile';
import { 
  LensPost, 
  createPost as apiCreatePost, 
  getPosts as apiGetPosts, 
  likePost as apiLikePost, 
  dislikePost as apiDislikePost, 
  bookmarkPost as apiBookmarkPost,
  tipUser as apiTipUser 
} from '@/services/lens-protocol';

interface PostContextType {
  posts: LensPost[];
  isLoading: boolean;
  error: string | null;
  createNewPost: (content: string, imageUrl?: string) => Promise<boolean>;
  likePost: (postId: string) => Promise<void>;
  dislikePost: (postId: string) => Promise<void>;
  bookmarkPost: (postId: string, collectionName?: string) => Promise<void>;
  tipUser: (postId: string, amount: number) => Promise<void>;
  refreshPosts: () => Promise<void>;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<LensPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { walletInfo } = useWallet();
  const { currentProfile } = useProfile();

  // Load posts on mount
  useEffect(() => {
    refreshPosts();
  }, []);

  // Create a new post
  const createNewPost = async (content: string, imageUrl?: string): Promise<boolean> => {
    if (!walletInfo) {
      toast({
        title: "Not Connected",
        description: "Please connect your wallet to post content",
        variant: "destructive",
      });
      return false;
    }

    if (!currentProfile) {
      toast({
        title: "No Profile",
        description: "Please create a profile before posting content",
        variant: "destructive",
      });
      return false;
    }

    if (!content.trim()) {
      toast({
        title: "Empty Content",
        description: "Please write something to post",
        variant: "destructive",
      });
      return false;
    }

    try {
      setIsLoading(true);
      const newPost = await apiCreatePost(content, imageUrl, walletInfo.address);
      
      console.log('Created new post with ID:', newPost.id);
      
      // Update local state with the new post
      setPosts(prevPosts => [newPost, ...prevPosts]);
      
      toast({
        title: "Post Created",
        description: "Your post has been published successfully",
      });
      
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error('Failed to create post:', err);
      setError('Failed to create post');
      toast({
        title: "Post Failed",
        description: "There was an error creating your post. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };

  // Like a post
  const handleLikePost = async (postId: string): Promise<void> => {
    if (!walletInfo) {
      toast({
        title: "Not Connected",
        description: "Please connect your wallet to like posts",
        variant: "destructive",
      });
      return;
    }

    // Validate postId
    if (!postId) {
      console.error('usePost: handleLikePost called with invalid postId:', postId);
      toast({
        title: "Error",
        description: "Invalid post ID",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('usePost: Liking post with ID:', postId);
      const updatedPost = await apiLikePost(postId, walletInfo.address);
      
      // Update local state with the updated post
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId ? updatedPost : post
        )
      );
      
      toast({
        title: "Post Liked",
        description: "Your like has been recorded",
      });
    } catch (err) {
      console.error('Failed to like post:', err);
      toast({
        title: "Action Failed",
        description: "There was an error liking the post. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Dislike a post
  const handleDislikePost = async (postId: string): Promise<void> => {
    if (!walletInfo) {
      toast({
        title: "Not Connected",
        description: "Please connect your wallet to dislike posts",
        variant: "destructive",
      });
      return;
    }

    // Validate postId
    if (!postId) {
      console.error('usePost: handleDislikePost called with invalid postId:', postId);
      toast({
        title: "Error",
        description: "Invalid post ID",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('usePost: Disliking post with ID:', postId);
      const updatedPost = await apiDislikePost(postId, walletInfo.address);
      
      // Update local state with the updated post
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId ? updatedPost : post
        )
      );
      
      toast({
        title: "Post Disliked",
        description: "Your dislike has been recorded",
      });
    } catch (err) {
      console.error('Failed to dislike post:', err);
      toast({
        title: "Action Failed",
        description: "There was an error disliking the post. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Bookmark a post
  const handleBookmarkPost = async (postId: string, collectionName: string = 'Favorites'): Promise<void> => {
    if (!walletInfo) {
      toast({
        title: "Not Connected",
        description: "Please connect your wallet to bookmark posts",
        variant: "destructive",
      });
      return;
    }

    // Validate postId
    if (!postId) {
      console.error('usePost: handleBookmarkPost called with invalid postId:', postId);
      toast({
        title: "Error",
        description: "Invalid post ID",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('usePost: Bookmarking post with ID:', postId);
      await apiBookmarkPost(postId, walletInfo.address, collectionName);
      
      toast({
        title: "Post Bookmarked",
        description: `Added to ${collectionName}`,
      });
    } catch (err) {
      console.error('Failed to bookmark post:', err);
      toast({
        title: "Action Failed",
        description: "There was an error bookmarking the post. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Tip a user
  const handleTipUser = async (postId: string, amount: number): Promise<void> => {
    if (!walletInfo) {
      toast({
        title: "Not Connected",
        description: "Please connect your wallet to tip users",
        variant: "destructive",
      });
      return;
    }

    // Validate postId
    if (!postId) {
      console.error('usePost: handleTipUser called with invalid postId:', postId);
      toast({
        title: "Error",
        description: "Invalid post ID",
        variant: "destructive",
      });
      return;
    }

    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid tip amount",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('usePost: Tipping post with ID:', postId, 'amount:', amount);
      await apiTipUser(postId, walletInfo.address, amount);
      
      toast({
        title: "Tip Sent",
        description: `Successfully tipped ${amount} MATIC`,
      });
    } catch (err) {
      console.error('Failed to tip user:', err);
      toast({
        title: "Tip Failed",
        description: "There was an error sending the tip. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Refresh posts from the API
  const refreshPosts = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const fetchedPosts = await apiGetPosts();
      console.log('usePost: Refreshed posts, count:', fetchedPosts.length);
      setPosts(fetchedPosts);
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to refresh posts:', err);
      setError('Failed to refresh posts');
      toast({
        title: "Refresh Failed",
        description: "There was an error refreshing your feed. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Provide the post context to the app
  return (
    <PostContext.Provider
      value={{
        posts,
        isLoading,
        error,
        createNewPost,
        likePost: handleLikePost,
        dislikePost: handleDislikePost,
        bookmarkPost: handleBookmarkPost,
        tipUser: handleTipUser,
        refreshPosts,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

// Hook to use the post context
export const usePost = () => {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error('usePost must be used within a PostProvider');
  }
  return context;
};
