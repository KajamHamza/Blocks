
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/main-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bookmark, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/hooks/useWallet';
import { LensPost } from '@/services/lens-protocol';
import PostCard from '@/components/post-card';

const Bookmarks = () => {
  const { walletInfo } = useWallet();
  const [bookmarks, setBookmarks] = useState<LensPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [collections, setCollections] = useState<string[]>(['Favorites', 'Read Later', 'Inspirations']);
  const [activeCollection, setActiveCollection] = useState('all');

  // In a production app, this would fetch from Lens Protocol or a dedicated bookmark service
  useEffect(() => {
    if (walletInfo?.address) {
      // Simulate loading bookmarks from storage
      const loadBookmarks = () => {
        const storedBookmarks = localStorage.getItem(`bookmarks_${walletInfo.address}`);
        if (storedBookmarks) {
          setBookmarks(JSON.parse(storedBookmarks));
        }
      };
      
      loadBookmarks();
    }
  }, [walletInfo]);

  // Filter bookmarks based on search and active collection
  const filteredBookmarks = bookmarks.filter(bookmark => {
    const matchesSearch = bookmark.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCollection = activeCollection === 'all' || bookmark.collection === activeCollection;
    return matchesSearch && matchesCollection;
  });

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto w-full px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Bookmarks</h1>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <Input
            placeholder="Search bookmarks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-800/50 border-gray-700"
          />
        </div>
        
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveCollection}>
          <TabsList className="mb-6 bg-gray-800/50 flex overflow-x-auto scrollbar-hide">
            <TabsTrigger value="all" className="flex-shrink-0">All Bookmarks</TabsTrigger>
            {collections.map(collection => (
              <TabsTrigger key={collection} value={collection} className="flex-shrink-0">
                {collection}
              </TabsTrigger>
            ))}
            <Button variant="ghost" className="text-xs text-blocks-primary" onClick={() => setCollections([...collections, `Collection ${collections.length + 1}`])}>
              + New
            </Button>
          </TabsList>
          
          <TabsContent value="all">
            {bookmarks.length > 0 ? (
              <div className="space-y-4">
                {filteredBookmarks.map(bookmark => (
                  <PostCard key={bookmark.id} post={bookmark} />
                ))}
                
                {filteredBookmarks.length === 0 && searchQuery && (
                  <div className="text-center p-8 text-gray-400">
                    No bookmarks match your search.
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-8 text-gray-400">
                <Bookmark size={48} className="mx-auto mb-4 opacity-50" />
                <p className="mb-2">You haven't saved any posts yet.</p>
                <p className="text-sm mb-4">When you bookmark a post, it will appear here.</p>
                <Button>Explore Content</Button>
              </div>
            )}
          </TabsContent>
          
          {collections.map(collection => (
            <TabsContent key={collection} value={collection}>
              <div className="text-center p-8 text-gray-400">
                <Bookmark size={48} className="mx-auto mb-4 opacity-50" />
                <p>No bookmarks in "{collection}" yet.</p>
                <p className="text-sm mt-2">Save posts to this collection to see them here.</p>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Bookmarks;
