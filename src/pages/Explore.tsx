
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PostCard from '@/components/post/PostCard';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, TrendingUp } from 'lucide-react';

// Mock trending data
const mockTrending = [
  { id: '1', tag: 'Web3', posts: 12500 },
  { id: '2', tag: 'BlocksRewards', posts: 8300 },
  { id: '3', tag: 'DeFi', posts: 7200 },
  { id: '4', tag: 'NFTs', posts: 6100 },
  { id: '5', tag: 'DAOs', posts: 4800 },
];

// Mock posts
const mockPosts = [
  {
    id: '1',
    author: {
      username: 'cryptoinfluencer',
      displayName: 'Crypto Influencer',
      avatar: undefined
    },
    content: 'The future of social media is here with Blocks! True decentralization means real ownership of your content. #Web3 #BlocksRewards',
    timestamp: '2023-04-05T14:48:00.000Z',
    likes: 1248,
    comments: 89,
    mirrors: 324,
    hasMirror: false,
    hasLiked: false,
    rating: 'platinum' as const
  },
  {
    id: '2',
    author: {
      username: 'defi_expert',
      displayName: 'DeFi Expert',
      avatar: undefined
    },
    content: 'Just integrated my Lens Protocol profile with Blocks. The interoperability is amazing! Now my content lives across the decentralized social graph. #DeFi #LensProtocol',
    timestamp: '2023-04-04T09:23:00.000Z',
    likes: 845,
    comments: 142,
    mirrors: 201,
    hasMirror: true,
    hasLiked: true,
    rating: 'gold' as const
  },
  {
    id: '3',
    author: {
      username: 'nft_creator',
      displayName: 'NFT Creator',
      avatar: undefined
    },
    content: 'My latest NFT collection is gaining traction! Thanks to everyone who has supported it so far. The community on Blocks is amazing! #NFTs #CreatorEconomy',
    timestamp: '2023-04-03T12:15:00.000Z',
    likes: 592,
    comments: 78,
    mirrors: 105,
    hasMirror: false,
    hasLiked: false,
    rating: 'silver' as const,
    images: [
      'https://images.unsplash.com/photo-1561214115-f2f134cc4912?q=80&w=1000',
    ]
  },
];

const Explore = () => {
  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <div className="sticky top-0 z-10 backdrop-blur-md bg-blocks-background/70 border-b border-white/10 p-4">
          <h1 className="text-xl font-bold mb-4">Explore</h1>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search Blocks" 
              className="pl-10 bg-white/5 border-white/10"
            />
          </div>
          
          <Tabs defaultValue="trending">
            <TabsList className="w-full bg-transparent border-b border-white/10">
              <TabsTrigger 
                value="trending" 
                className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-blocks-accent rounded-none"
              >
                Trending
              </TabsTrigger>
              <TabsTrigger 
                value="latest" 
                className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-blocks-accent rounded-none"
              >
                Latest
              </TabsTrigger>
              <TabsTrigger 
                value="top" 
                className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-blocks-accent rounded-none"
              >
                Top Rated
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="p-4 bg-white/5 mb-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-5 w-5 text-blocks-accent" />
            <h3 className="font-semibold">Trending Topics</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {mockTrending.map(trend => (
              <Badge 
                key={trend.id}
                className="bg-blocks-accent/20 text-blocks-accent hover:bg-blocks-accent hover:text-white cursor-pointer transition-colors"
              >
                #{trend.tag}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          {mockPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Explore;
