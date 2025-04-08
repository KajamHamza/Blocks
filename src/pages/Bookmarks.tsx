
import React from 'react';
import { Bookmark } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import PostCard from '@/components/post/PostCard';

const mockBookmarkedPosts = [
  {
    id: '1',
    author: {
      username: 'vitalik',
      displayName: 'Vitalik.eth',
      avatar: 'https://pbs.twimg.com/profile_images/977496875887558661/L86xyLF4_400x400.jpg'
    },
    content: "Just published a new paper on scalability solutions for L2. Check it out!",
    timestamp: '2023-04-05T14:48:00.000Z',
    likes: 532,
    comments: 89,
    mirrors: 124,
    hasMirror: false,
    hasLiked: false,
    rating: 'gold' as const,
    bookmarked: true
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
    bookmarked: true,
    images: [
      'https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1000',
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1000'
    ]
  }
];

const Bookmarks = () => {
  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <div className="sticky top-0 z-10 backdrop-blur-md bg-blocks-background/70 border-b border-white/10 px-4">
          <div className="flex items-center gap-3 py-4">
            <h1 className="text-xl font-bold">Bookmarks</h1>
            <Bookmark className="h-5 w-5 text-blocks-accent" />
          </div>
        </div>
        
        {mockBookmarkedPosts.length > 0 ? (
          <div>
            {mockBookmarkedPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Bookmark className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No bookmarks yet</h3>
            <p className="text-muted-foreground max-w-xs">
              When you bookmark posts, they will appear here for you to read later.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Bookmarks;
