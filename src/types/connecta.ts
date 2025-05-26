
/**
 * Tipos de dados para a plataforma Connecta
 * Definem a estrutura de posts, conexões e conversas
 */

export type CategoryType = 'focus' | 'expansion' | 'reflection';

export interface PostType {
  id: string;
  author: {
    name: string;
    avatar: string;
    username: string;
  };
  content: string;
  createdAt: string;
  likes: number;
  comments: number;
  saves: number;
  liked: boolean;
  saved: boolean;
  category: CategoryType;
  imageUrl?: string;
}

export interface ConnectionType {
  id: string;
  name: string;
  avatar: string;
  username: string;
  status: 'pending' | 'accepted' | 'suggested';
  mutualConnections?: number;
  commonInterests?: string[];
}

export interface ConversationType {
  id: string;
  participant: {
    name: string;
    avatar: string;
    username: string;
  };
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
}

export interface UserSuggestionType {
  id: string;
  name: string;
  avatar: string;
  username: string;
  commonCells: number;
  mutualConnections: number;
  isFollowing: boolean;
}

// Tipos do banco de dados para integração com Supabase
export interface DatabasePost {
  id: string;
  user_id: string;
  content: string;
  image_url?: string;
  category: CategoryType;
  likes_count: number;
  comments_count: number;
  saves_count: number;
  created_at: string;
  updated_at: string;
}

export interface DatabaseConnection {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface DatabaseConversation {
  id: string;
  participant_1: string;
  participant_2: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read_at?: string;
  created_at: string;
}

// Payloads para criação de dados
export interface PostPayload {
  content: string;
  category: CategoryType;
  image_url?: string;
}

export interface MessagePayload {
  content: string;
  recipient_id: string;
}

export interface ConnectionPayload {
  addressee_id: string;
}
