
import React from 'react';
import MainLayout from '@/components/main-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Users, Bookmark, TrendingUp, Star } from 'lucide-react';

const Communities = () => {
  const popularCommunities = [
    { name: 'Ethereum Devs', members: '42.5K', description: 'Community for Ethereum developers and enthusiasts', category: 'Development' },
    { name: 'NFT Marketplace', members: '36.2K', description: 'Discover, collect, and sell extraordinary NFTs', category: 'Art & Collectibles' },
    { name: 'DeFi Discussions', members: '28.9K', description: 'Everything about decentralized finance', category: 'Finance' },
    { name: 'Meme Economy', members: '19.3K', description: 'The best crypto and blockchain memes', category: 'Humor' },
    { name: 'Polygon Network', members: '15.7K', description: 'Official community for Polygon users and developers', category: 'Blockchain' },
  ];

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto w-full p-4 md:p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-white">Communities</h1>
          <p className="text-gray-400 mt-2">Discover and join communities of people with similar interests</p>
        </div>
        
        {/* Search */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-500" />
          </div>
          <Input
            type="text"
            placeholder="Search communities"
            className="pl-10 py-6 bg-gray-800/80 border-gray-700 text-white rounded-xl w-full"
          />
        </div>
        
        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-display font-semibold text-white mb-4">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="bg-gray-800/80 border-gray-700 hover:bg-gray-700 text-white h-auto py-4 justify-start gap-3">
              <TrendingUp size={18} className="text-blocks-primary" />
              <span>Trending</span>
            </Button>
            <Button variant="outline" className="bg-gray-800/80 border-gray-700 hover:bg-gray-700 text-white h-auto py-4 justify-start gap-3">
              <Star size={18} className="text-yellow-500" />
              <span>Featured</span>
            </Button>
            <Button variant="outline" className="bg-gray-800/80 border-gray-700 hover:bg-gray-700 text-white h-auto py-4 justify-start gap-3">
              <Users size={18} className="text-green-500" />
              <span>Your Communities</span>
            </Button>
            <Button variant="outline" className="bg-gray-800/80 border-gray-700 hover:bg-gray-700 text-white h-auto py-4 justify-start gap-3">
              <Bookmark size={18} className="text-purple-500" />
              <span>Saved</span>
            </Button>
          </div>
        </div>
        
        {/* Popular Communities */}
        <div>
          <h2 className="text-xl font-display font-semibold text-white mb-4">Popular Communities</h2>
          <div className="space-y-4">
            {popularCommunities.map((community, index) => (
              <Card key={index} className="bg-gray-800/80 border-gray-700 hover:bg-gray-700/80 transition-colors p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-blocks-primary/20 flex items-center justify-center">
                      <span className="text-blocks-primary text-lg font-bold">
                        {community.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-white font-medium">sb/{community.name}</h3>
                      <p className="text-gray-400 text-sm mt-1">{community.members} members</p>
                      <p className="text-gray-300 text-sm mt-2">{community.description}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="border-blocks-primary text-blocks-primary hover:bg-blocks-primary hover:text-white"
                  >
                    Join
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Communities;
