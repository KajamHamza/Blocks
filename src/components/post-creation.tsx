
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ImageIcon, SmileIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePost } from '@/hooks/usePost';
import { useProfile } from '@/hooks/useProfile';

interface PostCreationProps {
  className?: string;
}

const PostCreation: React.FC<PostCreationProps> = ({ className }) => {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createNewPost } = usePost();
  const { currentProfile } = useProfile();

  const handleSubmit = async () => {
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    try {
      const success = await createNewPost(content, imageUrl);
      if (success) {
        // Clear form after successful post
        setContent('');
        setImageUrl(undefined);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // In a real application, you would upload this to IPFS
    // For now, we'll create a temporary local URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageUrl(undefined);
  };

  return (
    <div className={cn("p-4 border-b border-gray-800/30", className)}>
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
            {currentProfile?.profilePicture ? (
              <img 
                src={currentProfile.profilePicture} 
                alt={currentProfile.username}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-gray-400 text-sm font-bold">
                {currentProfile?.username?.[0]?.toUpperCase() || 'U'}
              </span>
            )}
          </div>
        </div>
        <div className="flex-1">
          <div className="mb-3">
            <Textarea 
              placeholder="What's happening?"
              className="bg-transparent border-0 text-white text-base focus-visible:ring-0 p-0 min-h-[60px] resize-none placeholder:text-gray-500"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSubmitting}
            />
            
            {imageUrl && (
              <div className="relative mt-2 rounded-lg overflow-hidden w-full max-h-80">
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 rounded-full w-8 h-8 opacity-80 hover:opacity-100"
                  onClick={removeImage}
                >
                  <X size={16} />
                </Button>
                <img 
                  src={imageUrl} 
                  alt="Post attachment" 
                  className="w-full max-h-80 object-contain"
                />
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-blocks-primary">
              <label className="cursor-pointer">
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  disabled={isSubmitting}
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full text-blocks-primary hover:bg-blocks-primary/10"
                  type="button"
                  disabled={isSubmitting}
                  asChild
                >
                  <span>
                    <ImageIcon size={18} />
                  </span>
                </Button>
              </label>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full text-blocks-primary hover:bg-blocks-primary/10"
                disabled={isSubmitting}
              >
                <SmileIcon size={18} />
              </Button>
            </div>
            <Button 
              className="rounded-full bg-blocks-primary hover:bg-blocks-primary/90 text-sm"
              onClick={handleSubmit}
              disabled={isSubmitting || !content.trim()}
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCreation;
