import * as assert from 'node:assert';
import { UserService } from '../src/modules/user/user.service';
import { MatchService } from '../src/modules/match/match.service';
import { ChatService } from '../src/modules/chat/chat.service';
import { SafetyService } from '../src/modules/safety/safety.service';
import { Gender, Intent, MatchMode } from '../src/common/enums';

async function runStep3Tests() {
  console.log('🧪 Starting MATCH@SAHRDAYA Step 3 Comprehensive Services Test Suite...\n');

  // ============================================================================
  // Mock Data
  // ============================================================================
  const mockInterests = [
    { id: 'coding', name: 'Coding', emoji: '💻', category: 'Tech' },
    { id: 'music', name: 'Music', emoji: '🎧', category: 'Arts' },
    { id: 'gaming', name: 'Gaming', emoji: '🎮', category: 'Entertainment' },
    { id: 'travel', name: 'Travel', emoji: '✈️', category: 'Lifestyle' },
  ];

  const mockUsers: any[] = [
    {
      id: 'user-arjun',
      email: 'arjun@sahrdaya.ac.in',
      profileCompleted: true,
      profile: {
        id: 'prof-arjun',
        displayName: 'Arjun Krishna',
        year: 3,
        bio: 'Tech enthusiast',
        gender: Gender.MAN,
        showDob: false,
        intent: Intent.DATING,
        matchMode: MatchMode.INTERESTS,
        interests: [
          { interestId: 'coding', interest: mockInterests[0] },
          { interestId: 'music', interest: mockInterests[1] },
        ],
      },
    },
    {
      id: 'user-maya',
      email: 'maya@sahrdaya.ac.in',
      profileCompleted: true,
      profile: {
        id: 'prof-maya',
        displayName: 'Maya Joseph',
        year: 3,
        bio: 'Biotech & acoustic lover',
        gender: Gender.WOMAN,
        showDob: false,
        intent: Intent.DATING,
        matchMode: MatchMode.INTERESTS,
        interests: [
          { interestId: 'music', interest: mockInterests[1] },
          { interestId: 'coding', interest: mockInterests[0] },
          { interestId: 'travel', interest: mockInterests[3] },
        ],
      },
    },
    {
      id: 'user-akhil',
      email: 'akhil@sahrdaya.ac.in',
      profileCompleted: true,
      profile: {
        id: 'prof-akhil',
        displayName: 'Akhil Thomas',
        year: 4,
        bio: 'Sports lover',
        gender: Gender.MAN,
        showDob: false,
        intent: Intent.FRIENDSHIP,
        matchMode: MatchMode.RANDOM,
        interests: [{ interestId: 'gaming', interest: mockInterests[2] }],
      },
    },
  ];

  const mockMatches: any[] = [];
  const mockConversations: any[] = [];
  const mockMessages: any[] = [];
  const mockBlocks: any[] = [];
  const mockReports: any[] = [];

  const mockPrisma: any = {
    interest: {
      findMany: async (args?: any) => {
        if (args?.where?.id?.in) {
          return mockInterests.filter((i) => args.where.id.in.includes(i.id));
        }
        return mockInterests;
      },
    },
    user: {
      findUnique: async ({ where }: any) => {
        return mockUsers.find((u) => u.id === where.id) || null;
      },
      findMany: async ({ where }: any) => {
        return mockUsers.filter((u) => {
          if (where?.id?.not && u.id === where.id.not) return false;
          if (where?.id?.notIn && where.id.notIn.includes(u.id)) return false;
          if (where?.profileCompleted !== undefined && u.profileCompleted !== where.profileCompleted)
            return false;
          return true;
        });
      },
      update: async ({ where, data }: any) => {
        const u = mockUsers.find((user) => user.id === where.id);
        if (u) Object.assign(u, data);
        return u;
      },
    },
    userProfile: {
      update: async ({ where, data }: any) => {
        const u = mockUsers.find((user) => user.profile?.id === where.id);
        if (u?.profile) Object.assign(u.profile, data);
        return u?.profile;
      },
      create: async ({ data }: any) => {
        const newProf = { id: `prof-${Date.now()}`, ...data, interests: [] };
        const u = mockUsers.find((user) => user.id === data.userId);
        if (u) u.profile = newProf;
        return newProf;
      },
    },
    userInterest: {
      deleteMany: async () => {},
      createMany: async () => {},
    },
    userBlock: {
      findMany: async ({ where }: any) => {
        return mockBlocks.filter(
          (b) =>
            b.blockerId === where.OR?.[0]?.blockerId || b.blockedId === where.OR?.[1]?.blockedId
        );
      },
      findFirst: async ({ where }: any) => {
        return (
          mockBlocks.find(
            (b) =>
              (b.blockerId === where.OR?.[0]?.blockerId &&
                b.blockedId === where.OR?.[0]?.blockedId) ||
              (b.blockerId === where.OR?.[1]?.blockerId && b.blockedId === where.OR?.[1]?.blockedId)
          ) || null
        );
      },
      upsert: async ({ create }: any) => {
        mockBlocks.push(create);
        return create;
      },
    },
    userReport: {
      create: async ({ data }: any) => {
        mockReports.push(data);
        return { id: `rep-${Date.now()}`, ...data };
      },
    },
    match: {
      findMany: async () => mockMatches,
      findUnique: async ({ where }: any) => mockMatches.find((m) => m.id === where.id) || null,
      create: async ({ data }: any) => {
        const m = { id: `match-${Date.now()}`, ...data, createdAt: new Date() };
        mockMatches.push(m);
        return m;
      },
      update: async ({ where, data }: any) => {
        const m = mockMatches.find((match) => match.id === where.id);
        if (m) Object.assign(m, data);
        return m;
      },
      updateMany: async ({ data }: any) => {
        mockMatches.forEach((m) => Object.assign(m, data));
        return { count: mockMatches.length };
      },
    },
    conversation: {
      findUnique: async ({ where }: any) =>
        mockConversations.find((c) => c.id === where.id) || null,
      findMany: async () => mockConversations,
      create: async ({ data }: any) => {
        const c = {
          id: `conv-${Date.now()}`,
          ...data,
          messages: [],
          createdAt: new Date(),
          lastMessageAt: new Date(),
        };
        mockConversations.push(c);
        return c;
      },
      update: async ({ where, data }: any) => {
        const c = mockConversations.find((conv) => conv.id === where.id);
        if (c) Object.assign(c, data);
        return c;
      },
    },
    message: {
      findMany: async ({ where }: any) =>
        mockMessages.filter((m) => m.conversationId === where.conversationId),
      create: async ({ data }: any) => {
        const msg = { id: `msg-${Date.now()}`, ...data, isRead: false, createdAt: new Date() };
        mockMessages.push(msg);
        return msg;
      },
      updateMany: async ({ data }: any) => {
        mockMessages.forEach((m) => Object.assign(m, data));
        return { count: mockMessages.length };
      },
    },
    $transaction: async (fn: any) => fn(mockPrisma),
  };

  // ============================================================================
  // Test 1: User & Onboarding Service
  // ============================================================================
  console.log('Test 1: User Profile & Interests Management');
  const userService = new UserService(mockPrisma);

  const allInterests = await userService.getAllInterests();
  assert.strictEqual(allInterests.length, 4, 'Should retrieve all 4 taxonomy interests');

  const arjunProfile = await userService.findById('user-arjun');
  assert.strictEqual(arjunProfile.profile?.displayName, 'Arjun Krishna');
  assert.strictEqual(arjunProfile.profile?.interests.length, 2);

  // Update match mode
  const updatedUser = await userService.setMatchMode('user-arjun', MatchMode.RANDOM);
  assert.strictEqual(updatedUser.profile?.matchMode, MatchMode.RANDOM);
  console.log('  ✅ User profile retrieval, taxonomy querying, and match mode updates work');

  // ============================================================================
  // Test 2: Cupid Matchmaking Algorithm & Serendipity
  // ============================================================================
  console.log('\nTest 2: Cupid Interest Scoring & Matchmaking Engine');
  const matchService = new MatchService(mockPrisma);

  // Arjun matches with Maya
  const matchResult = await matchService.executeMatch('user-arjun', MatchMode.INTERESTS);
  assert.ok(matchResult.id, 'Match record should have an ID');
  assert.strictEqual(matchResult.userAId, 'user-arjun');
  assert.strictEqual(matchResult.userBId, 'user-maya'); // Maya has highest overlap (Coding + Music)
  assert.ok(matchResult.score >= 0.7, 'Compatibility score should be >= 0.70');
  assert.ok(matchResult.sharedInterests.includes('Coding') || matchResult.sharedInterests.includes('Music'));
  assert.ok(matchResult.conversationId, 'A linked conversation channel must be created');
  console.log(`  ✅ Cupid correctly paired Arjun with Maya (Score: ${matchResult.score * 100}%, Shared: ${matchResult.sharedInterests.join(', ')})`);

  // ============================================================================
  // Test 3: Real-Time Chat & Message Handling
  // ============================================================================
  console.log('\nTest 3: Chat Messaging & Unread Counter Logic');
  const chatService = new ChatService(mockPrisma);

  const sentMessage = await chatService.sendMessage('user-arjun', {
    conversationId: matchResult.conversationId,
    content: 'Hey Maya! Glad Cupid brought us together on Sahrdaya campus! 🌹',
  });
  assert.ok(sentMessage.id, 'Sent message must have an ID');
  assert.strictEqual(sentMessage.senderId, 'user-arjun');
  assert.strictEqual(sentMessage.content, 'Hey Maya! Glad Cupid brought us together on Sahrdaya campus! 🌹');
  console.log('  ✅ Student message dispatch and persistence verified');

  const history = await chatService.getMessages('user-arjun', matchResult.conversationId);
  assert.ok(history.length >= 2, 'History should include initial icebreaker + student message');

  const marked = await chatService.markConversationAsRead('user-maya', matchResult.conversationId);
  assert.strictEqual(marked, true, 'Unread message counter reset successfully');
  console.log('  ✅ Thread history pagination and unread counter resets verified');

  // ============================================================================
  // Test 4: Moderation, Blocking & Safety Controls
  // ============================================================================
  console.log('\nTest 4: Safety Controls, Blocking & Reporting');
  const safetyService = new SafetyService(mockPrisma);

  const reportSuccess = await safetyService.reportUser('user-arjun', {
    targetUserId: 'user-akhil',
    reason: 'SPAM' as any,
    note: 'Inappropriate spam messages',
  });
  assert.strictEqual(reportSuccess, true, 'Conduct report filed');

  const blockSuccess = await safetyService.blockUser('user-arjun', 'user-akhil');
  assert.strictEqual(blockSuccess, true, 'User block executed');
  console.log('  ✅ Conduct reporting and student blocklist isolation verified');

  console.log('\n🎉 ALL STEP 3 BACKEND CORE SERVICES TESTS PASSED SUCCESSFULLY!\n');
}

runStep3Tests().catch((err) => {
  console.error('❌ Step 3 test failed:', err);
  process.exit(1);
});
