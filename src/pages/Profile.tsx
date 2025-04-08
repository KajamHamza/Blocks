/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Link as LinkIcon, MapPin, Edit, BellOff, Loader2 } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import PostCard from '@/components/post/PostCard';
import { useWalletConnection } from '@/hooks/use-wallet-connection';
import { fetchProfileByIdOrHandle } from '@/lib/lens/profile-service';
import { fetchProfilePosts } from '@/lib/lens/post-service';
import { Account } from '@lens-protocol/client';

const Profile = () => {
  const { username } = useParams();
  const { address, lensProfile } = useWalletConnection();
  const [profile, setProfile] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);
  
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        let profileData: Account | null = null;
        
        // If a username is specified in the URL, fetch that profile
        if (username) {
          profileData = await fetchProfileByIdOrHandle(username);
        }
        // Otherwise use the logged in user's profile
        else if (lensProfile) {
          profileData = lensProfile;
        }
        // If no profile data available, fetch from connected wallet
        else if (address) {
          profileData = await fetchProfileByIdOrHandle(address);
        }
        
        if (profileData) {
          console.log('Loaded profile:', profileData);
          setProfile(profileData);
          
          // Fetch the user's posts
          const userPosts = await fetchProfilePosts(profileData.address);
          if (userPosts && userPosts.length > 0) {
            setPosts(userPosts);
          } else {
            setPosts([]);
          }
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, [username, lensProfile, address]);
  
  // Extract profile data from the profile object with fallbacks
  const profileData = React.useMemo(() => {
    if (!profile) return null;
    
    // Handle different profile picture structures in Lens Protocol response
    const profilePicture = profile.metadata?.picture;
    let avatarUrl = '';
    
    if (profilePicture) {
      if (typeof profilePicture === 'object' && profilePicture !== null && 'original' in profilePicture) {
        const original = profilePicture.original;
        if (original && typeof original === 'object' && 'url' in original) {
          avatarUrl = original.url as string;
        }
      } else if (typeof profilePicture === 'object' && profilePicture !== null && 'uri' in profilePicture) {
        avatarUrl = profilePicture.uri as string;
      }
    }
    
    // Handle different cover picture structures
    const coverPicture = profile.metadata?.coverPicture;
    let coverUrl = '';
    
    if (coverPicture) {
      if (typeof coverPicture === 'object' && coverPicture !== null && 'original' in coverPicture) {
        const original = coverPicture.original;
        if (original && typeof original === 'object' && 'url' in original) {
          coverUrl = original.url as string;
        }
      } else if (typeof coverPicture === 'object' && coverPicture !== null && 'uri' in coverPicture) {
        coverUrl = coverPicture.uri as string;
      }
    } else {
      coverUrl = 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1000';
    }
    
    return {
      username: profile?.username?.localName || 'username',
      displayName: profile.metadata?.name || profile.username?.localName || 'User',
      avatar: avatarUrl,
      coverImage: coverUrl,
      bio: profile.metadata?.bio || 'Web3 user',
      location: profile.metadata?.attributes?.find((attr: any) => attr.key === 'location')?.value,
      website: profile.metadata?.attributes?.find((attr: any) => attr.key === 'website')?.value,
      joinedDate: new Date(profile.createdAt || Date.now()).toLocaleString('en-US', { month: 'long', year: 'numeric' }),
      following: profile.stats?.following || 0,
      followers: profile.stats?.followers || 0,
      posts: profile.stats?.posts || 0,
      verified: !!profile.metadata?.attributes?.find((attr: any) => attr.key === 'verified'),
    };
  }, [profile]);
  
  const truncatedAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
  const isOwnProfile = !username; // If no username in URL, we're viewing our own profile

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading profile...</span>
        </div>
      </MainLayout>
    );
  }
  
  if (!profileData) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto pb-10 text-center pt-20">
          <h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't find the profile you're looking for.
          </p>
          <Button variant="default" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto pb-10">
        {/* Cover Image */}
        <div className="h-48 bg-blocks-card overflow-hidden">
          {profileData.coverImage ? (
            <img 
              src={profileData.coverImage} 
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blocks-accent/70 to-purple-600/70" />
          )}
        </div>
        
        {/* Profile Header */}
        <div className="px-4">
          <div className="flex justify-between items-start">
            <div className="mt-[-40px] h-20 w-20 rounded-full border-4 border-blocks-background overflow-hidden bg-blocks-accent">
              <Avatar className="h-full w-full">
                {profileData.avatar ? (
                  <AvatarImage src={profileData.avatar} alt={profileData.displayName} />
                ) : (
                  <AvatarFallback>
                    {profileData.displayName.charAt(0)}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
            
            <div className="mt-4 flex gap-2">
              {isOwnProfile ? (
                <Button variant="outline" size="sm" className="border-white/20">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit Profile
                </Button>
              ) : (
                <Button variant="outline" size="sm" className="border-white/20">
                  <BellOff className="h-4 w-4 mr-1" />
                  Follow
                </Button>
              )}
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{profileData.displayName}</h1>
              {profileData.verified && (
                <Badge className="bg-blocks-accent text-white">Verified</Badge>
              )}
            </div>
            <p className="text-muted-foreground">@{profileData.username}</p>
            <p className="text-muted-foreground text-sm">Lens ID: {truncatedAddress}</p>
            
            <p className="mt-3">{profileData.bio}</p>
            
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-sm text-muted-foreground">
              {profileData.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{profileData.location}</span>
                </div>
              )}
              
              {profileData.website && (
                <div className="flex items-center gap-1">
                  <LinkIcon className="h-4 w-4" />
                  <a 
                    href={profileData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blocks-accent hover:underline"
                  >
                    {(() => {
                      try {
                        return new URL(profileData.website).hostname
                      } catch {
                        return profileData.website
                      }
                    })()}
                  </a>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Joined {profileData.joinedDate}</span>
              </div>
            </div>
            
            <div className="flex gap-4 mt-3">
              <div className="font-semibold hover:underline cursor-pointer">
                <span>{profileData.following}</span>
                <span className="text-muted-foreground font-normal ml-1">Following</span>
              </div>
              <div className="font-semibold hover:underline cursor-pointer">
                <span>{profileData.followers}</span>
                <span className="text-muted-foreground font-normal ml-1">Followers</span>
              </div>
              <div>
                <span className="font-semibold">{profileData.posts}</span>
                <span className="text-muted-foreground ml-1">Posts</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Profile Tabs */}
        <div className="mt-4">
          <Tabs defaultValue="posts">
            <TabsList className="w-full bg-transparent border-b border-white/10">
              <TabsTrigger 
                value="posts" 
                className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-blocks-accent rounded-none"
              >
                Posts
              </TabsTrigger>
              <TabsTrigger 
                value="replies" 
                className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-blocks-accent rounded-none"
              >
                Replies
              </TabsTrigger>
              <TabsTrigger 
                value="media" 
                className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-blocks-accent rounded-none"
              >
                Media
              </TabsTrigger>
              <TabsTrigger 
                value="likes" 
                className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-blocks-accent rounded-none"
              >
                Likes
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="posts">
              {posts.length > 0 ? posts.map(post => (
                <PostCard key={post.id} post={{
                  ...post,
                  author: {
                    username: profileData.username,
                    displayName: profileData.displayName,
                    avatar: profileData.avatar
                  }
                }} />
              )) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <p className="text-muted-foreground">No posts yet</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="replies">
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <p className="text-muted-foreground">No replies yet</p>
              </div>
            </TabsContent>
            
            <TabsContent value="media">
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <p className="text-muted-foreground">No media posts yet</p>
              </div>
            </TabsContent>
            
            <TabsContent value="likes">
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <p className="text-muted-foreground">No liked posts yet</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
