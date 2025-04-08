
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useWalletConnection } from '@/hooks/use-wallet-connection';
import { createPost } from '@/lib/lens/post-service';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface CreatePostProps {
  userDisplayName?: string;
}

const CreatePost = ({ userDisplayName = 'You' }: CreatePostProps) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { lensProfile } = useWalletConnection();
  
  // Get profile data with fallbacks
  const profileName = lensProfile?.metadata?.displayName || 
                      lensProfile?.handle?.localName || 
                      userDisplayName;
  
  // Handle different profile picture structures in Lens Protocol response
  const profilePicture = lensProfile?.metadata?.picture;
  let profileAvatar = '';
  
  if (profilePicture) {
    if (profilePicture && typeof profilePicture === 'object') {
      // Handle original image object
      if ('original' in profilePicture) {
        const originalImage = profilePicture.original;
        if (originalImage && typeof originalImage === 'object' && 'url' in originalImage) {
          profileAvatar = originalImage.url as string;
        }
      } 
      // Handle uri directly
      else if ('uri' in profilePicture) {
        profileAvatar = profilePicture.uri as string;
      }
    }
  }
  
  const profileInitial = profileName ? profileName.charAt(0).toUpperCase() : 'Y';
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !lensProfile?.id) return;
    
    setIsSubmitting(true);
    
    try {
      // Submit the post to the Lens Protocol
      await createPost(lensProfile.id, content);
      toast.success('Post created successfully!');
      setContent('');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="border-b border-white/10 p-4">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">
          <Avatar className="h-10 w-10 bg-blocks-accent">
            {profileAvatar ? (
              <AvatarImage src={profileAvatar} alt={profileName} />
            ) : (
              <AvatarFallback>{profileInitial}</AvatarFallback>
            )}
          </Avatar>
          
          <div className="flex-1">
            <textarea
              placeholder="What's happening?"
              className="w-full bg-transparent resize-none border-none focus:outline-none focus:ring-0 text-md"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              disabled={isSubmitting}
            />
            
            <div className="flex justify-end mt-2">
              <Button 
                type="submit" 
                disabled={!content.trim() || isSubmitting || !lensProfile}
                size="sm"
                className="bg-blocks-accent hover:bg-blocks-accent/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  'Post'
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
