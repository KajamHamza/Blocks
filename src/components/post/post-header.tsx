
import React from 'react';
import { MoreHorizontal, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AwardType } from '@/types/post';

interface PostHeaderProps {
  username: string;
  handle: string;
  avatarUrl?: string;
  timestamp: string;
  userCreditRating: number;
  award: AwardType;
}

const PostHeader: React.FC<PostHeaderProps> = ({
  username,
  handle,
  avatarUrl,
  timestamp,
  userCreditRating,
  award,
}) => {
  const getCreditRatingColor = (rating: number) => {
    if (rating >= 1) return 'text-green-500';
    if (rating >= 0.5) return 'text-blue-500';
    if (rating >= 0) return 'text-gray-400';
    if (rating >= -0.05) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getAwardBadge = (award: AwardType) => {
    if (!award) return null;
    
    const badgeColors: Record<Exclude<AwardType, null>, string> = {
      bronze: 'bg-amber-700',
      silver: 'bg-gray-400',
      gold: 'bg-yellow-500',
      platinum: 'bg-indigo-300',
      diamond: 'bg-blue-300',
      ace: 'bg-purple-500',
      conqueror: 'bg-gradient-to-r from-red-500 to-purple-500',
    };
    
    return (
      <span className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white",
        badgeColors[award]
      )}>
        {award.charAt(0).toUpperCase() + award.slice(1)}
      </span>
    );
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="font-bold text-white text-sm">{username}</span>
          <span className="ml-1.5 text-gray-500 text-xs">@{handle}</span>
          <span className="mx-1 text-gray-500 text-xs">·</span>
          <span className="text-gray-500 text-xs">{timestamp}</span>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 hover:text-white hover:bg-gray-800/50 rounded-full">
          <MoreHorizontal size={14} />
        </Button>
      </div>
      
      <div className="flex items-center gap-2 mt-1">
        <span className={cn("text-xs font-medium", getCreditRatingColor(userCreditRating))}>
          UCR: {userCreditRating.toFixed(2)}
        </span>
        {award && getAwardBadge(award)}
      </div>
    </>
  );
};

export default PostHeader;
