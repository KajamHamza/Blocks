
import React from 'react';
import MainLayout from '@/components/main-layout';
import { Button } from '@/components/ui/button';
import {
  Bell,
  MessageCircle,
  Heart,
  Repeat,
  User,
  Users,
  Link as LinkIcon,
  ChevronRight
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Notifications = () => {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto w-full px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Notifications</h1>
        
        <div className="space-y-3">
          <div className="bg-gray-800/40 rounded-xl p-4 hover:bg-gray-800/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="rounded-full bg-purple-800/30 text-blocks-primary p-2">
                  <Bell size={18} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-white">
                    New feature: Communities are here!
                  </p>
                  <p className="text-xs text-gray-400">
                    Explore and join groups with shared interests.
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <ChevronRight size={16} />
                <span className="sr-only">View</span>
              </Button>
            </div>
          </div>
          
          <div className="bg-gray-800/40 rounded-xl p-4 hover:bg-gray-800/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gray-700">
                    <User size={16} />
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-white">
                    @username started following you.
                  </p>
                  <p className="text-xs text-gray-400">
                    5 hours ago
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 bg-gray-700/30 hover:bg-gray-700/50 text-gray-300 hover:text-white border border-gray-700/30"
              >
                Follow Back
              </Button>
            </div>
          </div>
          
          <div className="bg-gray-800/40 rounded-xl p-4 hover:bg-gray-800/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gray-700">
                    <User size={16} />
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-white">
                    @anotheruser liked your post.
                  </p>
                  <p className="text-xs text-gray-400">
                    1 day ago
                  </p>
                  <div className="mt-1.5 pl-1 border-l-2 border-gray-700 text-xs text-gray-300">
                    <p className="truncate max-w-[250px]">Your post about decentralized social media...</p>
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-400 hover:text-white"
              >
                <Heart size={16} />
                <span className="sr-only">Like</span>
              </Button>
            </div>
          </div>
          
          <div className="bg-gray-800/40 rounded-xl p-4 hover:bg-gray-800/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gray-700">
                    <User size={16} />
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-white">
                    @someuser mirrored your post.
                  </p>
                  <p className="text-xs text-gray-400">
                    2 days ago
                  </p>
                  <div className="mt-1.5 pl-1 border-l-2 border-gray-700 text-xs text-gray-300">
                    <p className="truncate max-w-[250px]">Lens Protocol is revolutionizing how we interact online...</p>
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-400 hover:text-white"
              >
                <Repeat size={16} />
                <span className="sr-only">Mirror</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Notifications;
