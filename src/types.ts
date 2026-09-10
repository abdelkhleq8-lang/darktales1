export type HorrorCategory = 
  | 'all'
  | 'haunted_houses'
  | 'folk_legends'
  | 'dark_entities'
  | 'mysterious_crimes'
  | 'psychological';

export interface Story {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    badge?: string;
  };
  category: HorrorCategory;
  categoryLabel: string;
  subGenreLabel: string;
  readTimeMinutes: number;
  likesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  featured?: boolean;
  audioUrl?: string;
  ambientAudio: {
    title: string;
    duration: string;
    type: string;
    defaultActive?: boolean;
  };
  createdAt: string;
}

export interface Comment {
  id: string;
  storyId: string;
  authorName: string;
  avatarColor: string;
  content: string;
  createdAt: string;
  likesCount: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  handle: string;
  bio: string;
  avatar: string;
  membershipBadge: string;
  joinedDate: string;
  readCount: number;
  immersionMinutes: number;
  isLoggedIn?: boolean;
}

export type HorrorSFX = 'whisper' | 'jumpscare' | 'creak' | 'heartbeat' | 'click' | 'whoosh' | 'footsteps' | 'screams';

export interface HorrorSoundOption {
  id: string;
  name: string;
  url: string;
  icon?: string;
  description?: string;
}

export interface Story24H {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorBadge?: string;
  mediaUrl: string;
  caption: string;
  ambientSound: 'wind' | 'whispers' | 'footsteps' | 'screams' | 'whisper' | 'heartbeat' | 'creak' | 'jumpscare';
  createdAt: number;
  expiresAt: number;
  viewsCount: number;
  isViewed?: boolean;
  isMine?: boolean;
}

