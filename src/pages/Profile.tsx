
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/main-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  User,
  Calendar,
  Link as LinkIcon,
  Twitter,
  Instagram,
  Github,
  Users,
  Edit,
  AtSign,
  Shield,
  MessageSquare,
  Repeat,
  Heart
} from "lucide-react";
import { useProfile } from '@/hooks/useProfile';
import { useWallet } from '@/hooks/useWallet';
import PostCard from '@/components/post-card';
import { usePost } from '@/hooks/usePost';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Profile = () => {
  const { currentProfile } = useProfile();
  const { walletInfo } = useWallet();
  const { posts, isLoading } = usePost();
  
  // Filter posts by the current user
  const userPosts = posts.filter(post => 
    post.authorAddress === walletInfo?.address
  );

  // If no profile, show placeholder data
  const profileData = currentProfile || {
    name: "Anonymous User",
    username: walletInfo ? `@${walletInfo.address.substring(0, 8)}...` : "@anonymous",
    bio: "No bio available.",
    location: "Unknown",
    website: "",
    socialLinks: {
      twitter: "",
      instagram: "",
      github: "",
      lens: ""
    },
    createdAt: Date.now(),
    followers: 0,
    following: 0,
    posts: userPosts.length,
    trustScore: 0.01
  };

  // Check if this is the current user's profile
  const isOwnProfile = currentProfile && walletInfo && currentProfile.address === walletInfo.address;

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto w-full px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Profile</h1>
          {isOwnProfile && (
            <Button variant="outline" size="sm" className="bg-transparent border-gray-700/30 hover:bg-gray-800">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </div>

        <div className="bg-gray-800/40 rounded-xl p-6 space-y-5">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="relative">
              <Avatar className="w-20 h-20 border-2 border-gray-700/50">
                {currentProfile?.profilePicture ? (
                  <AvatarImage 
                    src={currentProfile.profilePicture} 
                    alt={currentProfile.name || "Profile"} 
                    className="object-cover"
                  />
                ) : (
                  <AvatarFallback className="bg-gray-700 text-white">
                    <User size={32} />
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-purple-800/90 text-purple-300 rounded-full px-2 py-1 text-xs flex items-center border border-purple-700/50">
                <Shield className="h-3 w-3 mr-1" />
                <span>{profileData.trustScore || '0.01'}</span>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-bold">{profileData.name}</h2>
                <p className="text-sm text-gray-400">{profileData.username}</p>
                <p className="text-sm mt-1">{profileData.bio}</p>
              </div>
            </div>
          </div>
          
          {/* Profile Stats */}
          <div className="flex items-center justify-between border-t border-b border-gray-700/30 py-3">
            <div className="flex space-x-5">
              <div className="text-center">
                <p className="text-lg font-bold">{profileData.posts || 0}</p>
                <p className="text-xs text-gray-400">Posts</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">{profileData.followers || 0}</p>
                <p className="text-xs text-gray-400">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">{profileData.following || 0}</p>
                <p className="text-xs text-gray-400">Following</p>
              </div>
            </div>
            
            {!isOwnProfile && (
              <Button variant="outline" size="sm" className="bg-gray-700/30 border-gray-600/30 hover:bg-gray-700/50">
                Follow
              </Button>
            )}
          </div>
          
          {/* Profile Info */}
          <div className="space-y-2">
            {profileData.location && (
              <div className="text-sm text-gray-300 flex items-center space-x-2">
                <AtSign className="w-4 h-4 text-gray-500" />
                <span>{profileData.location}</span>
              </div>
            )}
            {profileData.website && (
              <div className="text-sm text-gray-300 flex items-center space-x-2">
                <LinkIcon className="w-4 h-4 text-gray-500" />
                <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="hover:underline text-blocks-primary">
                  {profileData.website}
                </a>
              </div>
            )}
            <div className="text-sm text-gray-300 flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>Joined {new Date(profileData.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex space-x-3">
            {profileData.socialLinks?.twitter && (
              <a href={`https://twitter.com/${profileData.socialLinks.twitter}`} target="_blank" rel="noopener noreferrer" className="bg-gray-700/30 text-gray-300 hover:text-blocks-primary p-2 rounded-full transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            )}
            {profileData.socialLinks?.instagram && (
              <a href={`https://instagram.com/${profileData.socialLinks.instagram}`} target="_blank" rel="noopener noreferrer" className="bg-gray-700/30 text-gray-300 hover:text-blocks-primary p-2 rounded-full transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            )}
            {profileData.socialLinks?.github && (
              <a href={`https://github.com/${profileData.socialLinks.github}`} target="_blank" rel="noopener noreferrer" className="bg-gray-700/30 text-gray-300 hover:text-blocks-primary p-2 rounded-full transition-colors">
                <Github className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>

        <div className="mt-8">
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="w-full mb-6 bg-gray-800/50">
              <TabsTrigger value="posts" className="flex-1 gap-2">
                <MessageSquare className="h-4 w-4" /> Posts
              </TabsTrigger>
              <TabsTrigger value="replies" className="flex-1 gap-2">
                <MessageSquare className="h-4 w-4" /> Replies
              </TabsTrigger>
              <TabsTrigger value="mirrors" className="flex-1 gap-2">
                <Repeat className="h-4 w-4" /> Mirrors
              </TabsTrigger>
              <TabsTrigger value="likes" className="flex-1 gap-2">
                <Heart className="h-4 w-4" /> Likes
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="posts">
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center p-8">Loading posts...</div>
                ) : userPosts.length > 0 ? (
                  userPosts.map(post => <PostCard key={post.id} post={post} />)
                ) : (
                  <div className="text-center p-8 text-gray-400">
                    No posts yet.
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="replies">
              <div className="text-center p-8 text-gray-400">
                No replies yet.
              </div>
            </TabsContent>
            
            <TabsContent value="mirrors">
              <div className="text-center p-8 text-gray-400">
                No mirrored posts yet.
              </div>
            </TabsContent>
            
            <TabsContent value="likes">
              <div className="text-center p-8 text-gray-400">
                No liked posts yet.
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
