
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

// Exemplo de payload para integração futura com Supabase
export interface PostPayload {
  content: string;
  category: CategoryType;
  imageUrl?: string;
  // TODO: user_id será preenchido automaticamente via auth.uid()
}

export interface MessagePayload {
  content: string;
  recipient_id: string;
  // TODO: sender_id será preenchido automaticamente via auth.uid()
}
