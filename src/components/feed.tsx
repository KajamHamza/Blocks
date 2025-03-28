
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PostCard, { AwardType } from './post-card';
import { cn } from '@/lib/utils';
import PostCreation from './post-creation';
import { usePost } from '@/hooks/usePost';
import { useProfile } from '@/hooks/useProfile';
import { Loader2 } from 'lucide-react';

interface FeedProps {
  className?: string;
}

const Feed: React.FC<FeedProps> = ({ className }) => {
  const { posts, isLoading } = usePost();
  const { currentProfile } = useProfile();
  
  // Mock data for posts (will be replaced with actual posts from Lens Protocol)
  const mockPosts = [
    {
      id: '1',
      username: 'CryptoExpert',
      handle: 'crypto_expert',
      avatarUrl: '',
      content: "Just published my analysis on the latest Ethereum upgrade. Bullish on the future! #Ethereum #Blockchain",
      timestamp: '2h',
      likes: 42,
      comments: 7,
      reposts: 5,
      userCreditRating: 4.20,
      award: 'gold' as AwardType,
      liked: true,
    },
    {
      id: '2',
      username: 'NFT Collector',
      handle: 'nft_whales',
      avatarUrl: '',
      content: 'Check out this amazing new NFT collection launching today! Limited edition, only 1000 available.',
      imageUrl: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1000&auto=format&fit=crop',
      timestamp: '4h',
      likes: 78,
      comments: 12,
      reposts: 15,
      userCreditRating: 0.69,
      award: 'silver' as AwardType,
    },
    {
      id: '3',
      username: 'Blockchain Dev',
      handle: 'web3_builder',
      avatarUrl: '',
      content: "Just deployed my first smart contract on Polygon. The gas fees are amazing compared to Ethereum mainnet! Here's what I've learned about optimizing code for lower gas consumption...",
      timestamp: '7h',
      likes: 156,
      comments: 23,
      reposts: 31,
      userCreditRating: 0.91,
      award: 'platinum' as AwardType,
    },
    {
      id: '4',
      username: 'DeFi Explorer',
      handle: 'defi_degen',
      avatarUrl: '',
      content: 'These yield farming rates are insane right now! Who else is taking advantage of the new liquidity pools?',
      timestamp: '10h',
      likes: 34,
      comments: 8,
      reposts: 3,
      userCreditRating: 0.01,
      award: null,
    },
    {
      id: '5',
      username: 'Crypto Memes',
      handle: 'nft_memes',
      avatarUrl: '',
      content: 'When your friends finally start asking you about blockchain after ignoring you for years',
      imageUrl: 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?q=80&w=1000&auto=format&fit=crop',
      timestamp: '12h',
      likes: 523,
      comments: 47,
      reposts: 128,
      userCreditRating: 2.15,
      award: 'diamond' as AwardType,
      liked: true,
    },
  ];

  // Convert Lens Protocol posts to PostCard format
  const convertLensPosts = () => {
    if (!posts.length) return [];
    
    return posts.map(post => {
      // In a real app, you would get this data from the Lens Protocol API
      return {
        id: post.id,
        username: currentProfile?.username || 'Anonymous',
        handle: currentProfile?.username?.toLowerCase() || 'anon',
        avatarUrl: currentProfile?.profilePicture || '',
        content: post.content,
        imageUrl: post.imageUrl,
        timestamp: formatTimestamp(post.createdAt),
        likes: 0,
        comments: 0,
        reposts: 0,
        userCreditRating: 0,
        award: null as AwardType,
      };
    });
  };
  
  // Format timestamp to relative time (e.g. "2h")
  const formatTimestamp = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return `${seconds}s`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  // Combine real posts with mock posts
  const allPosts = [...convertLensPosts(), ...mockPosts];

  return (
    <div className={cn("flex flex-col h-full border-x border-gray-800/30 scrollbar-hide", className)}>
      <Tabs defaultValue="foryou" className="w-full">
        {/* Tab header - stays fixed */}
        <div className="sticky top-0 z-10 bg-black/70 backdrop-blur-md border-b border-gray-800/30">
          <TabsList className="w-full p-0 bg-transparent h-auto">
            <TabsTrigger 
              value="foryou" 
              className="flex-1 py-4 rounded-none text-sm bg-transparent data-[state=active]:bg-transparent text-gray-400"
            >
              For You
            </TabsTrigger>
            <TabsTrigger 
              value="following" 
              className="flex-1 py-4 rounded-none text-sm bg-transparent data-[state=active]:bg-transparent text-gray-400"
            >
              Following
            </TabsTrigger>
            <TabsTrigger 
              value="community" 
              className="flex-1 py-4 rounded-none text-sm bg-transparent data-[state=active]:bg-transparent text-gray-400"
            >
              Community
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="foryou" className="mt-0 overflow-y-auto scrollbar-hide">
          {/* Post creation component */}
          <PostCreation />
          
          {/* Loading state */}
          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-8 h-8 text-blocks-primary animate-spin" />
            </div>
          )}
          
          {/* Posts */}
          {allPosts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </TabsContent>
        
        <TabsContent value="following" className="mt-0 overflow-y-auto scrollbar-hide">
          {/* Post creation component */}
          <PostCreation />
          
          <div className="p-8 text-center">
            <h3 className="text-xl font-medium text-white">Follow accounts to see their posts</h3>
            <p className="text-gray-400 mt-2">When you follow accounts, their posts will show up here.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="community" className="mt-0 overflow-y-auto scrollbar-hide">
          {/* Post creation component */}
          <PostCreation />
          
          <div className="p-8 text-center">
            <h3 className="text-xl font-medium text-white">Join communities to see their posts</h3>
            <p className="text-gray-400 mt-2">When you join communities, their posts will show up here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Feed;
