
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Repeat, 
  Heart, 
  Award, 
  MoreHorizontal,
  DollarSign,
  Share 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PostCardProps {
  post: {
    id: string;
    author: {
      username: string;
      displayName: string;
      avatar?: string;
    };
    content: string;
    timestamp: string;
    likes: number;
    comments: number;
    mirrors: number;
    hasMirror: boolean;
    hasLiked: boolean;
    rating?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'ace' | 'conqueror';
    images?: string[];
  };
}

const ratingColors = {
  bronze: 'bg-amber-700',
  silver: 'bg-gray-400',
  gold: 'bg-yellow-500',
  platinum: 'bg-slate-300',
  diamond: 'bg-cyan-300',
  ace: 'bg-purple-500',
  conqueror: 'bg-red-600'
};

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [liked, setLiked] = useState(post.hasLiked);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [mirrored, setMirrored] = useState(post.hasMirror);
  const [mirrorCount, setMirrorCount] = useState(post.mirrors);
  
  const handleLike = () => {
    if (liked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setLiked(!liked);
  };
  
  const handleMirror = () => {
    if (mirrored) {
      setMirrorCount(prev => prev - 1);
    } else {
      setMirrorCount(prev => prev + 1);
    }
    setMirrored(!mirrored);
  };

  const formattedDate = new Date(post.timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
  
  return (
    <div className="border-b border-white/10 p-4 hover:bg-white/5 transition-colors">
      <div className="flex gap-3">
        <Link to={`/profile/${post.author.username}`} className="flex-shrink-0">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.author.avatar} alt={post.author.displayName} />
            <AvatarFallback className="bg-blocks-accent text-white">
              {post.author.displayName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </Link>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <Link to={`/profile/${post.author.username}`} className="font-semibold hover:underline truncate">
              {post.author.displayName}
            </Link>
            <span className="text-muted-foreground text-sm">@{post.author.username}</span>
            <span className="text-muted-foreground text-sm">·</span>
            <span className="text-muted-foreground text-sm">{formattedDate}</span>
            
            <div className="ml-auto">
              <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className="mt-1 mb-3 whitespace-pre-wrap break-words">
            {post.content}
          </div>
          
          {post.images && post.images.length > 0 && (
            <div className={`grid ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-2 mb-3`}>
              {post.images.map((image, index) => (
                <img 
                  key={index}
                  src={image}
                  alt="Post content"
                  className="rounded-xl w-full h-auto object-cover max-h-72"
                />
              ))}
            </div>
          )}
          
          {post.rating && (
            <div className="mb-3">
              <Badge className={`${ratingColors[post.rating]} text-white uppercase text-xs`}>
                {post.rating}
              </Badge>
            </div>
          )}
          
          <div className="flex justify-between mt-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-muted-foreground hover:text-foreground hover:bg-white/5"
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {post.comments > 0 && (
                      <span className="text-xs">{post.comments}</span>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Comment</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`${mirrored ? 'text-green-400' : 'text-muted-foreground'} hover:text-green-400 hover:bg-green-400/10`}
                    onClick={handleMirror}
                  >
                    <Repeat className="h-4 w-4 mr-1" />
                    {mirrorCount > 0 && (
                      <span className="text-xs">{mirrorCount}</span>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mirror</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`${liked ? 'text-red-400' : 'text-muted-foreground'} hover:text-red-400 hover:bg-red-400/10`}
                    onClick={handleLike}
                  >
                    <Heart className={`h-4 w-4 mr-1 ${liked ? 'fill-current' : ''}`} />
                    {likeCount > 0 && (
                      <span className="text-xs">{likeCount}</span>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Like</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-muted-foreground hover:text-blue-400 hover:bg-blue-400/10"
                  >
                    <DollarSign className="h-4 w-4 mr-1" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Tip</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-muted-foreground hover:text-foreground hover:bg-white/5"
                  >
                    <Share className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
