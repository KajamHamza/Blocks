
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import CreatePost from '@/components/post/CreatePost';
import PostCard from '@/components/post/PostCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const mockPosts = [
  {
    id: '1',
    author: {
      username: 'vitalik',
      displayName: 'Vitalik.eth',
      avatar: 'https://pbs.twimg.com/profile_images/977496875887558661/L86xyLF4_400x400.jpg'
    },
    content: 'Just published a new paper on scalability solutions for L2. Check it out!',
    timestamp: '2023-04-05T14:48:00.000Z',
    likes: 532,
    comments: 89,
    mirrors: 124,
    hasMirror: false,
    hasLiked: false,
    rating: 'gold' as const
  },
  {
    id: '2',
    author: {
      username: 'lens_protocol',
      displayName: 'Lens Protocol',
      avatar: 'https://pbs.twimg.com/profile_images/1510169595379494912/I9Z1YJnw_400x400.jpg'
    },
    content: "Exciting news! We've just released a major update to our protocol. Now supporting custom collect modules and improved content discovery.",
    timestamp: '2023-04-04T09:23:00.000Z',
    likes: 421,
    comments: 56,
    mirrors: 87,
    hasMirror: true,
    hasLiked: true,
    rating: 'silver' as const
  },
  {
    id: '3',
    author: {
      username: 'blocksuser',
      displayName: 'Blocks Official',
      avatar: undefined
    },
    content: 'Welcome to Blocks! The decentralized social platform where your content truly belongs to you. Start posting and earning BLKS tokens today!',
    timestamp: '2023-04-03T12:15:00.000Z',
    likes: 892,
    comments: 145,
    mirrors: 267,
    hasMirror: false,
    hasLiked: true,
    rating: 'diamond' as const,
    images: [
      'https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1000',
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1000'
    ]
  },
  {
    id: '4',
    author: {
      username: 'cryptoenthusiast',
      displayName: 'Crypto Enthusiast',
      avatar: undefined
    },
    content: "Just joined Blocks and I'm loving the concept! The integration with Lens Protocol makes it so much easier to manage my Web3 social identity across platforms.",
    timestamp: '2023-04-02T18:30:00.000Z',
    likes: 76,
    comments: 12,
    mirrors: 5,
    hasMirror: false,
    hasLiked: false
  }
];

const Feed = () => {
  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <div className="sticky top-0 z-10 backdrop-blur-md bg-blocks-background/70 border-b border-white/10 px-4">
          <h1 className="text-xl font-bold py-4">Home</h1>
          <Tabs defaultValue="for-you">
            <TabsList className="w-full bg-transparent border-b border-white/10">
              <TabsTrigger 
                value="for-you" 
                className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-blocks-accent rounded-none"
              >
                For You
              </TabsTrigger>
              <TabsTrigger 
                value="following" 
                className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-blocks-accent rounded-none"
              >
                Following
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <CreatePost userDisplayName="Your Name" />
        
        <div>
          {mockPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Feed;
