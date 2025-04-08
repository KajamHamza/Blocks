
import React from 'react';
import { Search, User, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';

const RightPanel = () => {
  const trendingTopics = [
    { id: 1, name: 'Blockchain', posts: 5230 },
    { id: 2, name: 'NFTs', posts: 3479 },
    { id: 3, name: 'Decentralization', posts: 2845 },
    { id: 4, name: 'Web3', posts: 1932 },
    { id: 5, name: 'Crypto', posts: 1587 },
  ];

  const suggestedUsers = [
    { id: 1, name: 'Vitalik.eth', username: 'vitalik', followers: 2500000 },
    { id: 2, name: 'Satoshi', username: 'satoshi', followers: 1800000 },
    { id: 3, name: 'Web3Wizard', username: 'web3wizard', followers: 750000 },
  ];

  return (
    <aside className="w-80 border-l border-white/10 h-full p-4 overflow-y-auto">
      <div className="relative mb-6">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search Blocks" 
          className="pl-9 bg-white/5 border-white/10 focus:border-blocks-accent"
        />
      </div>
      
      <div className="bg-white/5 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-blocks-accent" />
          <h3 className="font-semibold">Trending Topics</h3>
        </div>
        <ul className="space-y-3">
          {trendingTopics.map(topic => (
            <li key={topic.id}>
              <a href="#" className="block hover:bg-white/5 p-2 rounded-lg transition-colors">
                <span className="font-medium text-white block">#{topic.name}</span>
                <span className="text-xs text-muted-foreground">{topic.posts.toLocaleString()} posts</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="bg-white/5 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <User className="h-5 w-5 text-blocks-accent" />
          <h3 className="font-semibold">Who to Follow</h3>
        </div>
        <ul className="space-y-4">
          {suggestedUsers.map(user => (
            <li key={user.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blocks-accent h-10 w-10 rounded-full flex items-center justify-center">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground">@{user.username}</p>
                </div>
              </div>
              <button className="text-xs bg-white/10 hover:bg-white/20 py-1.5 px-3 rounded-full transition-colors">
                Follow
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default RightPanel;
