
import React from 'react';
import { Search, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface RightSidebarProps {
  className?: string;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ className }) => {
  const trendingTopics = [
    { topic: 'Ethereum', posts: '2.5k', category: 'Crypto' },
    { topic: 'NFT Market', posts: '1.2k', category: 'Technology' },
    { topic: 'Web3 Jobs', posts: '845', category: 'Career' },
    { topic: 'DeFi Updates', posts: '632', category: 'Finance' },
    { topic: 'DAO Governance', posts: '521', category: 'Community' },
  ];

  const suggestedAccounts = [
    { name: 'Vitalik Buterin', username: '@vitalik', avatar: '' },
    { name: 'Polygon', username: '@0xPolygon', avatar: '' },
    { name: 'Crypto News', username: '@CryptoDaily', avatar: '' }
  ];

  return (
    <div className={cn("h-full w-full max-w-xs border-l border-gray-800/30 bg-black/20 backdrop-blur-md flex flex-col p-4 overflow-y-auto scrollbar-hide relative before:absolute before:inset-0 before:bg-noise-pattern before:opacity-5 before:z-0", className)}>
      {/* Search bar */}
      <div className="px-3 py-2 relative z-10">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-500" />
          </div>
          <Input
            type="text"
            placeholder="Search Blocks"
            className="bg-gray-900/70 border-0 text-white pl-10 py-5 rounded-full w-full focus:ring-0 text-sm"
          />
        </div>
      </div>
      
      {/* Trending topics */}
      <div className="px-3 py-3 mt-2 relative z-10">
        <h2 className="text-lg font-display font-bold text-white mb-3">Trending</h2>
        <div className="space-y-2">
          {trendingTopics.map((topic, index) => (
            <div key={index} className="cursor-pointer hover:bg-gray-800/50 p-2.5 rounded-lg transition-colors">
              <div className="flex items-start">
                <div className="flex-1">
                  <p className="text-xs text-gray-500">{topic.category}</p>
                  <p className="text-white text-sm font-medium mt-0.5">#{topic.topic}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{topic.posts} posts</p>
                </div>
                <TrendingUp size={16} className="text-blocks-primary mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Who to follow */}
      <div className="px-3 py-3 mt-2 relative z-10">
        <h2 className="text-lg font-display font-bold text-white mb-3">Who to follow</h2>
        <div className="space-y-3">
          {suggestedAccounts.map((account, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center">
                  {account.avatar ? (
                    <img src={account.avatar} alt={account.name} className="w-full h-full rounded-full" loading="lazy" />
                  ) : (
                    <span className="text-gray-400 text-xs font-medium">
                      {account.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{account.name}</p>
                  <p className="text-gray-500 text-xs">{account.username}</p>
                </div>
              </div>
              <Button variant="outline" className="text-blocks-primary border-blocks-primary/50 hover:bg-blocks-primary/10 hover:text-blocks-primary rounded-full py-1 px-3 text-xs h-7">
                Follow
              </Button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer links */}
      <div className="px-3 py-3 mt-auto relative z-10">
        <div className="flex flex-wrap gap-2">
          <a href="#" className="text-xs text-gray-500 hover:text-gray-400">Terms</a>
          <a href="#" className="text-xs text-gray-500 hover:text-gray-400">Privacy</a>
          <a href="#" className="text-xs text-gray-500 hover:text-gray-400">About</a>
          <a href="#" className="text-xs text-gray-500 hover:text-gray-400">Help</a>
        </div>
        <p className="mt-2 text-xs text-gray-500">© 2023 Blocks</p>
      </div>
    </div>
  );
};

export default RightSidebar;
