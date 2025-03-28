import React, { useState, useRef, ChangeEvent } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { useWallet } from '@/hooks/useWallet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { User, UserRound, Image, Link, Instagram, Twitter, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { SocialLinks } from '@/types/profile';

const profileFormSchema = z.object({
  username: z.string()
    .min(3, { message: 'Username must be at least 3 characters long' })
    .max(20, { message: 'Username cannot be longer than 20 characters' })
    .regex(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores' }),
  bio: z.string().max(160, { message: 'Bio cannot be longer than 160 characters' }).optional(),
  twitter: z.string().max(50, { message: 'Twitter handle is too long' }).optional(),
  instagram: z.string().max(50, { message: 'Instagram handle is too long' }).optional(),
  website: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfileSetup: React.FC = () => {
  const { walletInfo } = useWallet();
  const { createProfile, checkUsernameAvailability } = useProfile();
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: '',
      bio: '',
      twitter: '',
      instagram: '',
      website: '',
    },
  });

  const handleProfilePictureChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 2 * 1024 * 1024; // 2MB
      
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPEG, PNG, or GIF image",
          variant: "destructive",
        });
        return;
      }
      
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 2MB",
          variant: "destructive",
        });
        return;
      }
      
      setProfilePicture(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Clean up the object URL when it's no longer needed
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (values: ProfileFormValues) => {
    if (!walletInfo) {
      toast({
        title: "Connection Required",
        description: "Please connect your wallet to create a profile",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Validate username availability on Lens Protocol
      setIsCheckingUsername(true);
      const isAvailable = await checkUsernameAvailability(values.username);
      setIsCheckingUsername(false);
      
      if (!isAvailable) {
        form.setError('username', { 
          type: 'manual', 
          message: 'This username is already taken on Lens Protocol' 
        });
        setIsSubmitting(false);
        return;
      }

      const socialLinks: SocialLinks = {
        twitter: values.twitter || undefined,
        instagram: values.instagram || undefined,
        website: values.website || undefined,
      };

      // Create profile on Lens Protocol
      const success = await createProfile(
        walletInfo.address,
        values.username,
        values.bio || '',
        profilePicture,
        socialLinks
      );

      if (success) {
        toast({
          title: "Profile Created on Lens Protocol",
          description: "Your profile has been created successfully on the Lens Protocol",
        });
      }
    } catch (error) {
      console.error("Profile creation error:", error);
      toast({
        title: "Error Creating Profile",
        description: "There was an error creating your profile on Lens Protocol. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gray-900/80 backdrop-blur-lg rounded-xl shadow-lg border border-gray-700/50 overflow-hidden p-6 glass-card-dark">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-display font-bold text-gradient">Create Your Lens Protocol Profile</h2>
        <p className="text-gray-300 mt-2">Set up your identity on the decentralized social graph</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleProfilePictureChange}
              className="hidden"
              accept="image/jpeg, image/png, image/gif"
            />
            
            <Avatar className="w-24 h-24 cursor-pointer border-2 border-blocks-primary/50 hover:border-blocks-primary transition-colors" onClick={triggerFileInput}>
              {previewUrl ? (
                <AvatarImage src={previewUrl} alt="Profile picture preview" />
              ) : (
                <AvatarFallback className="bg-gray-800 text-white text-3xl">
                  <UserRound />
                </AvatarFallback>
              )}
            </Avatar>
            
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={triggerFileInput}
              className="border-gray-700 hover:bg-gray-800 text-gray-300"
            >
              <Image className="mr-2 h-4 w-4" />
              Upload Photo
            </Button>
            
            <FormDescription className="text-center text-sm text-gray-400">
              Tap the avatar to upload your profile picture (max 2MB)
            </FormDescription>
          </div>

          {/* Username */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Username</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 inset-y-0 flex items-center text-gray-500">
                      <User className="h-4 w-4" />
                    </span>
                    <Input 
                      className="pl-10 bg-gray-800/50 border-gray-700 text-white"
                      {...field}
                      disabled={isCheckingUsername}
                    />
                    {isCheckingUsername && (
                      <span className="absolute right-3 inset-y-0 flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin text-blocks-primary" />
                      </span>
                    )}
                  </div>
                </FormControl>
                <FormDescription className="text-gray-400">
                  This is your unique handle on Lens Protocol
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Bio */}
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Bio</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Tell the world a bit about yourself..." 
                    className="resize-none bg-gray-800/50 border-gray-700 text-white" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription className="text-gray-400">
                  A short bio about yourself (max 160 characters)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-gray-300">Social Links</h3>
            
            {/* Twitter */}
            <FormField
              control={form.control}
              name="twitter"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <span className="absolute left-3 inset-y-0 flex items-center text-gray-500">
                      <Twitter className="h-4 w-4" />
                    </span>
                    <Input 
                      className="pl-10 bg-gray-800/50 border-gray-700 text-white" 
                      placeholder="Twitter handle" 
                      {...field} 
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Instagram */}
            <FormField
              control={form.control}
              name="instagram"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <span className="absolute left-3 inset-y-0 flex items-center text-gray-500">
                      <Instagram className="h-4 w-4" />
                    </span>
                    <Input 
                      className="pl-10 bg-gray-800/50 border-gray-700 text-white" 
                      placeholder="Instagram handle" 
                      {...field} 
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Website */}
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <span className="absolute left-3 inset-y-0 flex items-center text-gray-500">
                      <Link className="h-4 w-4" />
                    </span>
                    <Input 
                      className="pl-10 bg-gray-800/50 border-gray-700 text-white" 
                      placeholder="Your website URL" 
                      {...field} 
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-blocks-primary hover:bg-blocks-primary/90 text-white" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Profile on Lens Protocol...
              </>
            ) : "Create Lens Protocol Profile"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ProfileSetup;
