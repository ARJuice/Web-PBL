import { DEMO_USERS, ALL_INTERESTS } from './mock-data';
import {
  Conversation,
  Match,
  MatchMode,
  Message,
  ReportRecord,
  User,
  UserProfile,
} from '@/types/match';

const STORAGE_KEYS = {
  CURRENT_USER_ID: 'match_sahrdaya_current_user_id',
  USERS: 'match_sahrdaya_users_v1',
  MATCHES: 'match_sahrdaya_matches_v1',
  CONVERSATIONS: 'match_sahrdaya_conversations_v1',
  MESSAGES: 'match_sahrdaya_messages_v1',
  BLOCKED_IDS: 'match_sahrdaya_blocked_ids_v1',
  REPORTS: 'match_sahrdaya_reports_v1',
};

function isClient(): boolean {
  return typeof window !== 'undefined';
}

export function getStoredUsers(): User[] {
  if (!isClient()) return DEMO_USERS;
  const stored = localStorage.getItem(STORAGE_KEYS.USERS);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback
    }
  }
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEMO_USERS));
  return DEMO_USERS;
}

export function saveUsers(users: User[]): void {
  if (!isClient()) return;
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

export function getCurrentUserId(): string {
  if (!isClient()) return 'user-arjun';
  const id = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
  if (!id) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, 'user-arjun');
    return 'user-arjun';
  }
  return id;
}

export function setCurrentUserId(id: string): void {
  if (!isClient()) return;
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, id);
}

export function getCurrentUser(): User | null {
  const users = getStoredUsers();
  const id = getCurrentUserId();
  const found = users.find((u) => u.id === id);
  if (found) return found;
  return users[0] || null;
}

export function loginWithEmail(email: string): User {
  const normalized = email.toLowerCase().trim();
  const users = getStoredUsers();
  let user = users.find((u) => u.email.toLowerCase() === normalized);

  if (!user) {
    const isCollegeDomain = normalized.endsWith('@sahrdaya.ac.in');
    const localPart = normalized.split('@')[0] || 'student';
    const cleanName = localPart
      .split(/[._-]/)
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ');

    user = {
      id: `user-${Date.now()}`,
      email: normalized,
      profileCompleted: false,
      createdAt: new Date().toISOString(),
      profile: isCollegeDomain
        ? {
            displayName: cleanName,
            year: 1,
            bio: 'Sahrdaya student ready to meet great people.',
            gender: 'PREFER_NOT_TO_SAY',
            showDob: false,
            intent: 'DATING',
            matchMode: 'INTERESTS',
            interests: [ALL_INTERESTS[0], ALL_INTERESTS[1]],
            avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80`,
          }
        : undefined,
    };
    users.push(user);
    saveUsers(users);
  }

  setCurrentUserId(user.id);
  return user;
}

export function upsertProfile(userId: string, profile: UserProfile): User {
  const users = getStoredUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) {
    const newUser: User = {
      id: userId,
      email: `${userId}@sahrdaya.ac.in`,
      profileCompleted: true,
      createdAt: new Date().toISOString(),
      profile,
    };
    users.push(newUser);
    saveUsers(users);
    return newUser;
  }

  users[index].profile = profile;
  users[index].profileCompleted = true;
  saveUsers(users);
  return users[index];
}

// MATCHES & CONVERSATIONS
function getInitialMatches(): Match[] {
  return [
    {
      id: 'match-arjun-maya',
      userAId: 'user-arjun',
      userBId: 'user-maya',
      candidateProfile: DEMO_USERS[1].profile!,
      candidateEmail: DEMO_USERS[1].email,
      score: 0.8,
      sharedInterests: ['Music', 'Coding', 'Travel'],
      mode: 'INTERESTS',
      createdAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
      status: 'ACTIVE',
      conversationId: 'conv-arjun-maya',
    },
  ];
}

function getInitialConversations(): Conversation[] {
  return [
    {
      id: 'conv-arjun-maya',
      matchId: 'match-arjun-maya',
      participantIds: ['user-arjun', 'user-maya'],
      otherUser: {
        id: 'user-maya',
        displayName: 'Maya Joseph',
        avatarUrl: DEMO_USERS[1].profile?.avatarUrl,
        year: 2,
        bio: DEMO_USERS[1].profile?.bio,
        sharedInterests: ['Music', 'Coding', 'Travel'],
      },
      lastMessage: {
        id: 'msg-init-2',
        conversationId: 'conv-arjun-maya',
        senderId: 'user-maya',
        content: 'Hey Arjun! Saw that we both love indie acoustic tracks and coding. Happy Valentine season! 🌹',
        createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
      },
      unreadCount: 1,
    },
  ];
}

function getInitialMessages(): Record<string, Message[]> {
  return {
    'conv-arjun-maya': [
      {
        id: 'msg-init-1',
        conversationId: 'conv-arjun-maya',
        senderId: 'user-arjun',
        content: 'Hi Maya! Cupid brought us together on MATCH@SAHRDAYA 😊',
        createdAt: new Date(Date.now() - 3600 * 1000 * 3).toISOString(),
      },
      {
        id: 'msg-init-2',
        conversationId: 'conv-arjun-maya',
        senderId: 'user-maya',
        content: 'Hey Arjun! Saw that we both love indie acoustic tracks and coding. Happy Valentine season! 🌹',
        createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
      },
    ],
  };
}

export function getStoredMatches(): Match[] {
  if (!isClient()) return getInitialMatches();
  const raw = localStorage.getItem(STORAGE_KEYS.MATCHES);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {}
  }
  const initial = getInitialMatches();
  localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(initial));
  return initial;
}

export function saveMatches(matches: Match[]): void {
  if (!isClient()) return;
  localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
}

export function getStoredConversations(): Conversation[] {
  if (!isClient()) return getInitialConversations();
  const raw = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {}
  }
  const initial = getInitialConversations();
  localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(initial));
  return initial;
}

export function saveConversations(convs: Conversation[]): void {
  if (!isClient()) return;
  localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(convs));
}

export function getStoredMessages(): Record<string, Message[]> {
  if (!isClient()) return getInitialMessages();
  const raw = localStorage.getItem(STORAGE_KEYS.MESSAGES);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {}
  }
  const initial = getInitialMessages();
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(initial));
  return initial;
}

export function saveMessages(messagesMap: Record<string, Message[]>): void {
  if (!isClient()) return;
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messagesMap));
}

export function getBlockedUserIds(): string[] {
  if (!isClient()) return [];
  const raw = localStorage.getItem(STORAGE_KEYS.BLOCKED_IDS);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {}
  }
  return [];
}

export function blockUser(userIdToBlock: string): void {
  if (!isClient()) return;
  const blocked = getBlockedUserIds();
  if (!blocked.includes(userIdToBlock)) {
    blocked.push(userIdToBlock);
    localStorage.setItem(STORAGE_KEYS.BLOCKED_IDS, JSON.stringify(blocked));
  }

  // Update match status
  const matches = getStoredMatches();
  const currentUserId = getCurrentUserId();
  const updatedMatches = matches.map((m) => {
    if (
      (m.userAId === currentUserId && m.userBId === userIdToBlock) ||
      (m.userBId === currentUserId && m.userAId === userIdToBlock)
    ) {
      return { ...m, status: 'BLOCKED' as const };
    }
    return m;
  });
  saveMatches(updatedMatches);
}

export function reportUser(report: Omit<ReportRecord, 'id' | 'createdAt'>): void {
  if (!isClient()) return;
  const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
  let reports: ReportRecord[] = [];
  if (raw) {
    try {
      reports = JSON.parse(raw);
    } catch {}
  }
  reports.push({
    ...report,
    id: `report-${Date.now()}`,
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
}

// MATCHMAKING ALGORITHM
export interface MatchCalculationResult {
  candidate: User;
  score: number;
  sharedInterests: string[];
}

export function findEligibleCandidates(
  currentUser: User,
  allUsers: User[],
  existingMatches: Match[],
  blockedIds: string[]
): User[] {
  return allUsers.filter((candidate) => {
    // 1. Cannot match with self
    if (candidate.id === currentUser.id) return false;
    // 2. Profile must be completed
    if (!candidate.profileCompleted || !candidate.profile) return false;
    // 3. Cannot be blocked
    if (blockedIds.includes(candidate.id)) return false;
    // 4. Duplicate match prevention (both directions)
    const hasAlreadyMatched = existingMatches.some(
      (m) =>
        m.status !== 'BLOCKED' &&
        ((m.userAId === currentUser.id && m.userBId === candidate.id) ||
          (m.userBId === currentUser.id && m.userAId === candidate.id))
    );
    if (hasAlreadyMatched) return false;
    return true;
  });
}

export function calculateInterestScore(
  userAInterests: string[],
  userBInterests: string[]
): { score: number; shared: string[] } {
  const setA = new Set(userAInterests.map((s) => s.toLowerCase()));
  const shared: string[] = [];

  for (const b of userBInterests) {
    if (setA.has(b.toLowerCase())) {
      shared.push(b);
    }
  }

  const maxLen = Math.max(userAInterests.length, userBInterests.length);
  if (maxLen === 0) return { score: 0, shared: [] };

  const score = Number((shared.length / maxLen).toFixed(2));
  return { score, shared };
}

export function executeMatchmaking(
  currentUser: User,
  overrideMode?: MatchMode
): Match | null {
  const allUsers = getStoredUsers();
  const existingMatches = getStoredMatches();
  const blockedIds = getBlockedUserIds();

  const candidates = findEligibleCandidates(
    currentUser,
    allUsers,
    existingMatches,
    blockedIds
  );

  if (candidates.length === 0) {
    return null;
  }

  const currentProfile = currentUser.profile;
  if (!currentProfile) return null;

  const mode = overrideMode || currentProfile.matchMode || 'INTERESTS';
  let chosenCandidate: User;
  let compatibilityScore = 0.5;
  let sharedInterests: string[] = [];

  if (mode === 'INTERESTS') {
    const userInterestNames = currentProfile.interests.map((i) => i.name);

    // Score all candidates
    const scoredCandidates = candidates.map((cand) => {
      const candInterestNames = cand.profile!.interests.map((i) => i.name);
      const { score, shared } = calculateInterestScore(
        userInterestNames,
        candInterestNames
      );
      return { candidate: cand, score, shared };
    });

    // Sort descending by score
    scoredCandidates.sort((a, b) => b.score - a.score);
    const best = scoredCandidates[0];
    chosenCandidate = best.candidate;
    compatibilityScore = Math.max(0.3, best.score);
    sharedInterests = best.shared;
  } else {
    // Random selection
    const randomIndex = Math.floor(Math.random() * candidates.length);
    chosenCandidate = candidates[randomIndex];
    const userInterestNames = currentProfile.interests.map((i) => i.name);
    const candInterestNames = chosenCandidate.profile!.interests.map((i) => i.name);
    const { score, shared } = calculateInterestScore(
      userInterestNames,
      candInterestNames
    );
    compatibilityScore = score;
    sharedInterests = shared;
  }

  const matchId = `match-${Date.now()}`;
  const convId = `conv-${Date.now()}`;

  const newMatch: Match = {
    id: matchId,
    userAId: currentUser.id,
    userBId: chosenCandidate.id,
    candidateProfile: chosenCandidate.profile!,
    candidateEmail: chosenCandidate.email,
    score: compatibilityScore,
    sharedInterests,
    mode,
    createdAt: new Date().toISOString(),
    status: 'ACTIVE',
    conversationId: convId,
  };

  // Save new match
  const updatedMatches = [newMatch, ...existingMatches];
  saveMatches(updatedMatches);

  // Create conversation
  const convs = getStoredConversations();
  const newConv: Conversation = {
    id: convId,
    matchId,
    participantIds: [currentUser.id, chosenCandidate.id],
    otherUser: {
      id: chosenCandidate.id,
      displayName: chosenCandidate.profile!.displayName,
      avatarUrl: chosenCandidate.profile!.avatarUrl,
      year: chosenCandidate.profile!.year,
      bio: chosenCandidate.profile!.bio,
      sharedInterests,
    },
    lastMessage: {
      id: `msg-${Date.now()}-welcome`,
      conversationId: convId,
      senderId: 'system',
      content: `Cupid linked you with ${chosenCandidate.profile!.displayName}! Send the first hello.`,
      createdAt: new Date().toISOString(),
    },
    unreadCount: 0,
  };
  saveConversations([newConv, ...convs]);

  // Initial messages
  const messagesMap = getStoredMessages();
  messagesMap[convId] = [
    {
      id: `msg-${Date.now()}-welcome`,
      conversationId: convId,
      senderId: 'system',
      content: `Cupid linked you with ${chosenCandidate.profile!.displayName}! Say hi and break the ice! ✨`,
      createdAt: new Date().toISOString(),
    },
  ];
  saveMessages(messagesMap);

  return newMatch;
}

export function sendMessage(
  conversationId: string,
  senderId: string,
  content: string
): Message {
  const trimmed = content.trim();
  if (!trimmed) throw new Error('Message content cannot be blank');

  const msgId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const newMessage: Message = {
    id: msgId,
    conversationId,
    senderId,
    content: trimmed,
    createdAt: new Date().toISOString(),
  };

  const messagesMap = getStoredMessages();
  if (!messagesMap[conversationId]) {
    messagesMap[conversationId] = [];
  }
  messagesMap[conversationId].push(newMessage);
  saveMessages(messagesMap);

  // Update conversation lastMessage
  const convs = getStoredConversations();
  const updatedConvs = convs.map((c) => {
    if (c.id === conversationId) {
      return {
        ...c,
        lastMessage: newMessage,
      };
    }
    return c;
  });
  saveConversations(updatedConvs);

  return newMessage;
}

// Simulated auto-reply helper from the match partner
export function triggerSimulatedMatchReply(
  conversationId: string,
  partnerName: string,
  partnerId: string,
  onReply: (replyMsg: Message) => void
): () => void {
  const romanticReplies = [
    `Hey! I'm so glad we got matched on MATCH@SAHRDAYA! How is your semester going?`,
    `Haha that's sweet! Are you free to grab a coffee at the campus canteen sometime this week? ☕`,
    `I totally agree! By the way, what kind of songs have been on your repeat playlist lately? 🎶`,
    `Cupid definitely had good taste matching us! What branch are you in?`,
    `Awesome! Let's definitely talk more. Are you attending any of the Valentine college events? 🌸`,
  ];

  const randomReply =
    romanticReplies[Math.floor(Math.random() * romanticReplies.length)];

  const timer = setTimeout(() => {
    const reply = sendMessage(conversationId, partnerId, randomReply);
    onReply(reply);
  }, 2400);

  return () => clearTimeout(timer);
}
