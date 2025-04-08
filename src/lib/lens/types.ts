import type { FragmentOf } from "@lens-protocol/client";
import { AccountFragment } from "./fragments";

declare module "@lens-protocol/client" {
  export interface Account extends FragmentOf<typeof AccountFragment> {
    isFollowing?: boolean;
    isFollowedBy?: boolean;
    stats?: {
      followers: number;
      following: number;
      posts: number;
    };
  }

  export interface AccountMetadata {
    name: string;
    bio: string;
    thumbnail?: {
      url: string;
      mimeType: string;
      width: number;
      height: number;
    };
    picture?: {
      url: string;
      mimeType: string;
      width: number;
      height: number;
    };
    customFields?: Record<string, string>;
    socialLinks?: {
      twitter?: string;
      github?: string;
      website?: string;
    };
  }

  export interface MediaImage {
    url: string;
    mimeType: string;
    width: number;
    height: number;
    alt?: string;
    optimizedUrl?: string;
  }
} 