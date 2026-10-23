export type Gender = 'MAN' | 'WOMAN' | 'NON_BINARY' | 'PREFER_NOT_TO_SAY';

export type Intent =
  | 'DATING'
  | 'FRIENDSHIP'
  | 'PARTNER'
  | 'LIKE_MINDED_FRIEND'
  | 'JUST_CHAT';

export type MatchMode = 'INTERESTS' | 'RANDOM';

export type MatchStatus = 'ACTIVE' | 'BLOCKED' | 'ENDED';

export type ReportReason =
  | 'SPAM'
  | 'HARASSMENT'
  | 'INAPPROPRIATE_CONTENT'
  | 'FAKE_PROFILE'
  | 'OTHER';

export interface Interest {
  id: string;
  name: string;
  emoji: string;
  category?: string;
}

export interface UserProfile {
  displayName: string;
  year: number; // 1 - 4
  bio: string;
  gender: Gender;
  showDob: boolean;
  dateOfBirth?: string;
  intent: Intent;
  matchMode: MatchMode;
  interests: Interest[];
  avatarUrl?: string;
}

export interface User {
  id: string;
  email: string;
  profileCompleted: boolean;
  createdAt: string;
  profile?: UserProfile;
}

export interface Match {
  id: string;
  userAId: string;
  userBId: string;
  candidateProfile: UserProfile;
  candidateEmail: string;
  score?: number; // 0.0 - 1.0 (e.g. 0.85 = 85%)
  sharedInterests: string[];
  mode: MatchMode;
  createdAt: string;
  status: MatchStatus;
  conversationId: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  matchId: string;
  participantIds: string[];
  otherUser: {
    id: string;
    displayName: string;
    avatarUrl?: string;
    year: number;
    bio?: string;
    sharedInterests: string[];
  };
  lastMessage?: Message;
  unreadCount: number;
}

export interface AffiliateProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  affiliateUrl: string;
  tag: string;
}

export interface ReportRecord {
  id: string;
  targetUserId: string;
  reporterUserId: string;
  reason: ReportReason;
  note?: string;
  createdAt: string;
}
