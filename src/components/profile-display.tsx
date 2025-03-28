import React from 'react';
import { useProfile } from '@/hooks/useProfile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserRound, Edit, Twitter, Instagram, Link } from 'lucide-react';
import { shortenAddress } from '@/lib/utils';

const ProfileDisplay: React.FC = () => {
  const { currentProfile } = useProfile();
  
  if (!currentProfile) return null;
  
  return (
    <div className="rounded-lg bg-gray-800/50 border border-gray-700/50 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-14 w-14 border-2 border-gray-700/50">
            {currentProfile.profilePicture ? (
              <AvatarImage src={currentProfile.profilePicture} alt={currentProfile.username} />
            ) : (
              <AvatarFallback className="bg-gray-800 text-white">
                <UserRound className="h-6 w-6" />
              </AvatarFallback>
            )}
          </Avatar>
          
          <div>
            <h3 className="font-bold text-white">
              {currentProfile.username}
            </h3>
            <p className="text-xs text-gray-400">
              {shortenAddress(currentProfile.address)}
            </p>
          </div>
        </div>
        
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit Profile</span>
        </Button>
      </div>
      
      {currentProfile.bio && (
        <p className="text-sm text-gray-300">
          {currentProfile.bio}
        </p>
      )}
      
      {/* Social Links */}
      {(currentProfile.socialLinks.twitter || 
       currentProfile.socialLinks.instagram || 
       currentProfile.socialLinks.website) && (
        <div className="flex gap-2">
          {currentProfile.socialLinks.twitter && (
            <a 
              href={`https://twitter.com/${currentProfile.socialLinks.twitter}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-purple-400 transition-colors"
            >
              <Twitter className="h-4 w-4" />
              <span className="sr-only">Twitter</span>
            </a>
          )}
          
          {currentProfile.socialLinks.instagram && (
            <a 
              href={`https://instagram.com/${currentProfile.socialLinks.instagram}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-purple-400 transition-colors"
            >
              <Instagram className="h-4 w-4" />
              <span className="sr-only">Instagram</span>
            </a>
          )}
          
          {currentProfile.socialLinks.website && (
            <a 
              href={currentProfile.socialLinks.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-purple-400 transition-colors"
            >
              <Link className="h-4 w-4" />
              <span className="sr-only">Website</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileDisplay;
