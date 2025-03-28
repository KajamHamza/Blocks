
export interface SocialLinks {
  twitter?: string;
  instagram?: string;
  github?: string;
  lens?: string;
  website?: string;
  [key: string]: string | undefined;
}

export interface UserProfile {
  address: string;
  username: string;
  name?: string;
  bio?: string;
  profilePicture?: string;
  coverPicture?: string;
  location?: string;
  website?: string;
  socialLinks: SocialLinks;
  followers?: number;
  following?: number;
  posts?: number;
  trustScore?: number;
  createdAt: number;
  updatedAt?: number;
}
