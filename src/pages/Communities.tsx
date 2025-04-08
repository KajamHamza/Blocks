
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, TrendingUp, Plus, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data for communities
const mockCommunities = [
  {
    id: '1',
    name: 'Investing',
    prefix: 'sb/investing',
    description: 'Discussions about crypto investing, DeFi, and trading strategies.',
    members: 12500,
    posts: 1450,
    joined: true,
    trending: true
  },
  {
    id: '2',
    name: 'DeFi',
    prefix: 'sb/defi',
    description: 'Everything about decentralized finance protocols and yield farming.',
    members: 8720,
    posts: 980,
    joined: false,
    trending: true
  },
  {
    id: '3',
    name: 'NFT Creators',
    prefix: 'sb/nft-creators',
    description: 'For artists and collectors in the NFT space to share their work and insights.',
    members: 6340,
    posts: 780,
    joined: true,
    trending: false
  },
  {
    id: '4',
    name: 'Web3 Developers',
    prefix: 'sb/web3-dev',
    description: 'Technical discussions about blockchain development, smart contracts, and dApps.',
    members: 9100,
    posts: 1230,
    joined: false,
    trending: true
  },
  {
    id: '5',
    name: 'Governance',
    prefix: 'sb/governance',
    description: 'Discussions about DAOs, protocol governance, and voting systems.',
    members: 5200,
    posts: 620,
    joined: false,
    trending: false
  },
  {
    id: '6',
    name: 'Memes',
    prefix: 'sb/memes',
    description: 'The best crypto and Web3 memes on the blockchain.',
    members: 15800,
    posts: 2300,
    joined: true,
    trending: true
  }
];

const Communities = () => {
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Communities</h1>
          <Button className="bg-blocks-accent hover:bg-blocks-accent/90">
            <Plus className="mr-2 h-4 w-4" />
            Create Community
          </Button>
        </div>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search communities" 
            className="pl-10 bg-white/5 border-white/10"
          />
        </div>
        
        <Tabs defaultValue="discover">
          <TabsList className="mb-6">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="joined">Joined</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
          </TabsList>
          
          <TabsContent value="discover">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockCommunities.map(community => (
                <CommunityCard key={community.id} community={community} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="joined">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockCommunities
                .filter(c => c.joined)
                .map(community => (
                  <CommunityCard key={community.id} community={community} />
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="trending">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockCommunities
                .filter(c => c.trending)
                .map(community => (
                  <CommunityCard key={community.id} community={community} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

interface CommunityCardProps {
  community: {
    id: string;
    name: string;
    prefix: string;
    description: string;
    members: number;
    posts: number;
    joined: boolean;
    trending: boolean;
  };
}

const CommunityCard = ({ community }: CommunityCardProps) => {
  return (
    <Card className="bg-blocks-card border-white/10 overflow-hidden">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">{community.name}</CardTitle>
            <CardDescription className="text-muted-foreground">{community.prefix}</CardDescription>
          </div>
          {community.trending && (
            <div className="bg-blocks-accent/20 text-blocks-accent p-1.5 rounded-full">
              <TrendingUp className="h-4 w-4" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{community.description}</p>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{community.members.toLocaleString()} members</span>
          </div>
          <div className="text-muted-foreground">
            {community.posts.toLocaleString()} posts
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant={community.joined ? "outline" : "default"} 
          className={`w-full ${community.joined ? 'border-white/20' : 'bg-blocks-accent hover:bg-blocks-accent/90'}`}
        >
          {community.joined ? 'Joined' : 'Join'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Communities;
