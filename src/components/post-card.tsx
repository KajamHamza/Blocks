
import React from 'react';
import { cn } from '@/lib/utils';
import { LensPost } from '@/services/lens-protocol';
import { useProfile } from '@/hooks/useProfile';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import PostHeader from './post/post-header';
import PostActions from './post/post-actions';
import { PostCardProps } from '@/types/post';

const PostCard: React.FC<PostCardProps | { post: LensPost; className?: string }> = (props) => {
  const { getProfileByAddress, allProfiles } = useProfile();
  
  // If post prop is provided, extract data from it
  if ('post' in props) {
    const { post, className } = props;
    
    // Try to get author profile from profiles cache
    const authorProfile = allProfiles[post.authorAddress];
    
    // Use profile data if available, otherwise fallback to address
    const username = authorProfile?.username || post.authorAddress.slice(0, 6) + '...' + post.authorAddress.slice(-4);
    const handle = authorProfile?.username || post.authorAddress.slice(0, 6).toLowerCase();
    const avatarUrl = authorProfile?.profilePicture;

    console.log('PostCard: Converting LensPost to PostCardProps with postId:', post.id);
    
    // Map LensPost properties to PostCardProps
    return (
      <PostCard
        username={username}
        handle={handle}
        avatarUrl={avatarUrl}
        content={post.content}
        imageUrl={post.imageUrl}
        timestamp={new Date(post.createdAt).toLocaleDateString()}
        likes={post.likes || 0}
        comments={post.comments || 0}
        reposts={post.reposts || 0}
        userCreditRating={post.userCreditRating || 0}
        award={post.award || null}
        liked={post.likes ? post.likes > 0 : false}
        className={className}
        postId={post.id}
      />
    );
  }

  // Regular props usage - this is now always guaranteed to have a postId
  const {
    username,
    handle,
    avatarUrl,
    content,
    imageUrl,
    timestamp,
    likes,
    comments,
    reposts,
    userCreditRating,
    award,
    liked = false,
    className,
    postId,
  } = props;

  console.log('PostCard: Rendering post with ID:', postId);

  return (
    <div className={cn("border-b border-gray-800/30 p-4 hover:bg-gray-900/30 transition-colors", className)}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <Avatar className="w-10 h-10 bg-gray-800">
            {avatarUrl ? (
              <AvatarImage 
                src={avatarUrl} 
                alt={username} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <AvatarFallback className="bg-gray-800 text-gray-400">
                <User size={16} />
              </AvatarFallback>
            )}
          </Avatar>
        </div>
        
        <div className="flex-1 min-w-0">
          <PostHeader
            username={username}
            handle={handle}
            avatarUrl={avatarUrl}
            timestamp={timestamp}
            userCreditRating={userCreditRating}
            award={award}
          />
          
          <div className="mt-2 text-white">
            <p className="whitespace-pre-line text-sm">{content}</p>
          </div>
          
          {imageUrl && (
            <div className="mt-3 rounded-lg overflow-hidden">
              <img 
                src={imageUrl} 
                alt="Post attachment" 
                className="w-full h-auto object-cover max-h-80"
                loading="lazy"
              />
            </div>
          )}
          
          <PostActions
            postId={postId}
            likes={likes}
            comments={comments}
            reposts={reposts}
            liked={liked}
          />
        </div>
      </div>
    </div>
  );
};

export default PostCard;
