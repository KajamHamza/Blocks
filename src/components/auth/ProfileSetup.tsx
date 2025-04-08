
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Camera, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useWalletConnection } from '@/hooks/use-wallet-connection';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const steps = [
  {
    id: 'username',
    name: 'Username',
    description: 'Choose your unique identifier',
  },
  {
    id: 'bio',
    name: 'About You',
    description: 'Tell the world about yourself',
  },
  {
    id: 'avatar',
    name: 'Profile Picture',
    description: 'Show your unique style',
  },
  {
    id: 'cover',
    name: 'Cover Image',
    description: 'Complete your profile',
  },
];

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { createLensProfile, address } = useWalletConnection();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form data
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [cover, setCover] = useState<string | null>(null);
  
  const handleNext = () => {
    setError(null);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Create the Lens profile
      await createLensProfile(username, bio);
      
      // Store avatar and cover in localStorage
      if (avatar) localStorage.setItem('lensProfilePicture', avatar);
      if (cover) localStorage.setItem('lensCoverPicture', cover);
      
      setCompleted(true);
      
      // Redirect to feed after a short delay
      setTimeout(() => {
        navigate('/feed');
      }, 2000);
    } catch (error) {
      console.error('Profile creation failed:', error);
      if (error instanceof Error) {
        setError(error.message);
        toast.error(error.message);
      } else {
        setError('Failed to create profile');
        toast.error('Failed to create profile');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        if (type === 'avatar') {
          setAvatar(reader.result);
        } else {
          setCover(reader.result);
        }
      }
    };
    reader.readAsDataURL(file);
  };
  
  const canProceed = () => {
    switch (currentStep) {
      case 0: return username.length >= 3;
      case 1: return bio.length > 0;
      case 2: return true; // Avatar is optional
      case 3: return true; // Cover is optional
      default: return false;
    }
  };
  
  // If setup is complete, show success screen
  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6 animate-fade-up">
        <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Profile Created Successfully!</h2>
        <p className="text-muted-foreground mb-6">
          Welcome to Blocks, {username}! 
          <br />Your journey in decentralized social media begins now.
        </p>
        <div className="text-sm text-muted-foreground">Redirecting to your feed...</div>
      </div>
    );
  }
  
  return (
    <div className="max-w-md mx-auto p-6 animate-fade-in">
      {/* Progress indicator */}
      <div className="flex justify-between mb-8">
        {steps.map((step, i) => (
          <div key={step.id} className="flex flex-col items-center">
            <div 
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2",
                i < currentStep 
                  ? "bg-blocks-accent border-blocks-accent text-white" 
                  : i === currentStep
                  ? "border-blocks-accent text-blocks-accent"
                  : "border-gray-600 text-gray-600"
              )}
            >
              {i < currentStep ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </div>
            <div className="text-xs mt-2 hidden sm:block">{step.name}</div>
          </div>
        ))}
      </div>
      
      {/* Current step title */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">{steps[currentStep].name}</h2>
        <p className="text-muted-foreground">{steps[currentStep].description}</p>
      </div>
      
      {/* Step content */}
      <div className="mb-8">
        {currentStep === 0 && (
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-muted-foreground">@</span>
                <Input 
                  id="username"
                  placeholder="Choose a username"
                  className="pl-8"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoFocus
                />
              </div>
              <p className="text-xs text-muted-foreground">Your username will be used to identify you across the Lens Protocol</p>
            </div>
            
            <div className="bg-muted/30 rounded-lg p-4 text-sm flex items-start">
              <div className="w-full text-center">
                <p>Your wallet address</p>
                <code className="bg-black/30 px-2 py-1 rounded text-xs mt-1 block truncate">
                  {address || '0x...'}
                </code>
              </div>
            </div>
          </div>
        )}
        
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="bio">About You</Label>
              <Textarea 
                id="bio"
                placeholder="Tell us about yourself..."
                className="min-h-[120px]"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                Your bio will be displayed on your Lens Protocol profile
              </p>
            </div>
          </div>
        )}
        
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-background">
                  {avatar ? (
                    <AvatarImage src={avatar} alt="Avatar preview" />
                  ) : (
                    <AvatarFallback className="bg-blocks-accent text-3xl">
                      {username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <label 
                  htmlFor="avatar-upload" 
                  className="absolute bottom-0 right-0 bg-blocks-accent rounded-full p-2 cursor-pointer shadow-lg hover:bg-blocks-accent/90 transition-colors"
                >
                  <Camera className="h-5 w-5" />
                  <input
                    id="avatar-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'avatar')}
                  />
                </label>
              </div>
            </div>
            <p className="text-sm text-center text-muted-foreground">
              Upload a profile picture or continue with the generated one
            </p>
          </div>
        )}
        
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="relative w-full aspect-[3/1] rounded-lg overflow-hidden">
                {cover ? (
                  <img 
                    src={cover} 
                    alt="Cover preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-blocks-accent/70 to-purple-600/70 flex items-center justify-center">
                    <p className="text-white text-lg font-semibold">Add Cover Image</p>
                  </div>
                )}
                <label 
                  htmlFor="cover-upload" 
                  className="absolute bottom-4 right-4 bg-blocks-accent rounded-full p-2 cursor-pointer shadow-lg hover:bg-blocks-accent/90 transition-colors"
                >
                  <Camera className="h-5 w-5" />
                  <input
                    id="cover-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'cover')}
                  />
                </label>
              </div>
            </div>
            <p className="text-sm text-center text-muted-foreground">
              Select a cover image for your Lens profile
            </p>
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded-md text-sm text-red-200">
            {error}
          </div>
        )}
      </div>
      
      {/* Navigation buttons */}
      <div className="flex justify-end">
        <Button
          onClick={handleNext}
          disabled={!canProceed() || isSubmitting}
          className="min-w-[120px]"
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : currentStep === steps.length - 1 ? (
            <>Complete</>
          ) : (
            <>Next <ArrowRight className="ml-2 h-4 w-4" /></>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProfileSetup;
