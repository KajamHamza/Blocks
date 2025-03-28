
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';
import { useWallet } from '@/hooks/useWallet';
import { useProfile } from '@/hooks/useProfile';
import { 
  LensPost, 
  createPost, 
  getPosts, 
  likePost, 
  dislikePost, 
  bookmarkPost,
  tipUser 
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
    const loadPosts = async () => {
      try {
        setIsLoading(true);
        const fetchedPosts = await getPosts();
        setPosts(fetchedPosts);
      } catch (err) {
        console.error('Failed to load posts:', err);
        setError('Failed to load posts');
        toast({
          title: "Error",
          description: "Failed to load posts. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

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
      const newPost = await createPost(content, imageUrl, walletInfo.address);
      
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

  const handleLikePost = async (postId: string): Promise<void> => {
    if (!walletInfo) {
      toast({
        title: "Not Connected",
        description: "Please connect your wallet to like posts",
        variant: "destructive",
      });
      return;
    }

    try {
      const updatedPost = await likePost(postId, walletInfo.address);
      
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

  const handleDislikePost = async (postId: string): Promise<void> => {
    if (!walletInfo) {
      toast({
        title: "Not Connected",
        description: "Please connect your wallet to dislike posts",
        variant: "destructive",
      });
      return;
    }

    try {
      const updatedPost = await dislikePost(postId, walletInfo.address);
      
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

  const handleBookmarkPost = async (postId: string, collectionName: string = 'Favorites'): Promise<void> => {
    if (!walletInfo) {
      toast({
        title: "Not Connected",
        description: "Please connect your wallet to bookmark posts",
        variant: "destructive",
      });
      return;
    }

    try {
      await bookmarkPost(postId, walletInfo.address, collectionName);
      
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

  const handleTipUser = async (postId: string, amount: number): Promise<void> => {
    if (!walletInfo) {
      toast({
        title: "Not Connected",
        description: "Please connect your wallet to tip users",
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
      await tipUser(postId, walletInfo.address, amount);
      
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

  const refreshPosts = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const fetchedPosts = await getPosts();
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

export const usePost = () => {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error('usePost must be used within a PostProvider');
  }
  return context;
};
