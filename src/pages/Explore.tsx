
import React, { useState } from 'react';
import MainLayout from '@/components/main-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePost } from '@/hooks/usePost';
import PostCard from '@/components/post-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, TrendingUp, Users, Flame } from 'lucide-react';

const Explore = () => {
  const { posts, isLoading } = usePost();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock categories for trending topics
  const trendingTopics = [
    'Lens Protocol', 'Web3', 'Blockchain', 'NFTs', 'DeFi', 
    'Social Graph', 'Polygon', 'Decentralization', 'DAOs'
  ];

  // Filter posts based on search query
  const filteredPosts = posts.filter(post => 
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto w-full px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Explore</h1>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <Input
            placeholder="Search posts, users, and topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-800/50 border-gray-700"
          />
        </div>
        
        <Tabs defaultValue="trending" className="w-full">
          <TabsList className="w-full mb-6 bg-gray-800/50">
            <TabsTrigger value="trending" className="flex-1">
              <TrendingUp className="mr-2 h-4 w-4" /> Trending
            </TabsTrigger>
            <TabsTrigger value="latest" className="flex-1">
              <Flame className="mr-2 h-4 w-4" /> Latest
            </TabsTrigger>
            <TabsTrigger value="people" className="flex-1">
              <Users className="mr-2 h-4 w-4" /> People
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="trending">
            <div className="flex flex-wrap gap-2 mb-6">
              {trendingTopics.map(topic => (
                <Button 
                  key={topic} 
                  variant="outline" 
                  className="bg-gray-800/50 border-gray-700 hover:bg-gray-700"
                >
                  #{topic.replace(' ', '')}
                </Button>
              ))}
            </div>
            
            <div className="space-y-4">
              {isLoading ? (
                Array(3).fill(null).map((_, i) => (
                  <div key={i} className="bg-gray-800/40 rounded-xl p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-16 w-full mb-3" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ))
              ) : filteredPosts.length > 0 ? (
                filteredPosts.map(post => <PostCard key={post.id} post={post} />)
              ) : (
                <div className="text-center p-8 text-gray-400">
                  {searchQuery ? 'No posts match your search.' : 'No posts available.'}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="latest">
            <div className="space-y-4">
              {isLoading ? (
                Array(3).fill(null).map((_, i) => (
                  <div key={i} className="bg-gray-800/40 rounded-xl p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-16 w-full mb-3" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ))
              ) : filteredPosts.length > 0 ? (
                // Show posts sorted by creation date (newest first)
                [...filteredPosts]
                  .sort((a, b) => b.createdAt - a.createdAt)
                  .map(post => <PostCard key={post.id} post={post} />)
              ) : (
                <div className="text-center p-8 text-gray-400">
                  {searchQuery ? 'No posts match your search.' : 'No posts available.'}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="people">
            <div className="text-center p-8 text-gray-400">
              <Users size={48} className="mx-auto mb-4 opacity-50" />
              <p>User discovery will be implemented with Lens Protocol's social graph API.</p>
              <Button variant="outline" className="mt-4">
                Coming Soon
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Explore;
