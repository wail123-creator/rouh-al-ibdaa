
export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  savedPostIds: string[];
  followingIds: string[]; // List of user IDs this user follows
  followerIds: string[];  // List of user IDs following this user
  followersCount: number;
  followingCount: number;
  isVerified?: boolean;
  isOnline?: boolean;
  lastSeen?: any;
}

export interface Comment {
  id: string;
  authorId?: string;
  authorName: string;
  content: string;
  date: string;
  imageUrl?: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  likes: number;
  date: string;
  imageUrl?: string;
  comments: Comment[];
  likedBy?: string[]; // Array of user IDs who liked this post
  isVerifiedAuthor?: boolean;
  createdAt?: any;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface Chat {
  id: string;
  participantId: string;
  participantName: string;
  lastMessage: string;
  timestamp: string;
  messages: ChatMessage[];
  isOnline?: boolean; // Real-time status for the other participant
}

export interface AppNotification {
  id: string;
  type: 'LIKE' | 'COMMENT' | 'MESSAGE' | 'FOLLOW';
  fromId: string;
  fromName: string;
  content: string;
  date: string;
  postId?: string;
  isRead: boolean;
  createdAt?: any;
}

export type View = 'LOGIN' | 'SIGNUP' | 'FEED' | 'CREATE' | 'PROFILE' | 'SEARCH' | 'MESSAGES' | 'CHAT_DETAIL' | 'NOTIFICATIONS' | 'PUBLIC_PROFILE' | 'FOLLOW_LIST' | 'POST_DETAIL' | 'ADMIN';
