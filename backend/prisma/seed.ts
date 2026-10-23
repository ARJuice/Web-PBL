import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ALL_INTERESTS = [
  { id: 'coding', name: 'Coding', emoji: '💻', category: 'Tech' },
  { id: 'music', name: 'Music', emoji: '🎧', category: 'Arts' },
  { id: 'movies', name: 'Movies', emoji: '🎬', category: 'Arts' },
  { id: 'anime', name: 'Anime', emoji: '🍙', category: 'Entertainment' },
  { id: 'gaming', name: 'Gaming', emoji: '🎮', category: 'Entertainment' },
  { id: 'football', name: 'Football', emoji: '⚽', category: 'Sports' },
  { id: 'cricket', name: 'Cricket', emoji: '🏏', category: 'Sports' },
  { id: 'startups', name: 'Startups', emoji: '🚀', category: 'Business' },
  { id: 'photography', name: 'Photography', emoji: '📸', category: 'Arts' },
  { id: 'travel', name: 'Travel', emoji: '✈️', category: 'Lifestyle' },
  { id: 'books', name: 'Books', emoji: '📚', category: 'Lifestyle' },
  { id: 'fitness', name: 'Fitness', emoji: '💪', category: 'Lifestyle' },
  { id: 'art', name: 'Art', emoji: '🎨', category: 'Arts' },
  { id: 'fashion', name: 'Fashion', emoji: '✨', category: 'Lifestyle' },
  { id: 'food', name: 'Food', emoji: '🍜', category: 'Lifestyle' },
  { id: 'memes', name: 'Memes', emoji: '😹', category: 'Fun' },
  { id: 'dance', name: 'Dance', emoji: '💃', category: 'Arts' },
  { id: 'technology', name: 'Technology', emoji: '⚡', category: 'Tech' },
  { id: 'entrepreneurship', name: 'Entrepreneurship', emoji: '💡', category: 'Business' },
  { id: 'design', name: 'Design', emoji: '🪄', category: 'Design' },
];

const DEMO_USERS = [
  {
    id: 'user-arjun',
    email: 'arjun@sahrdaya.ac.in',
    profileCompleted: true,
    profile: {
      displayName: 'Arjun Krishna',
      year: 3,
      bio: 'CS junior tinkering with code & indie music. Always down for canteen tea and debates on cinema.',
      gender: 'MAN',
      showDob: false,
      dateOfBirth: new Date('2004-05-14'),
      intent: 'DATING',
      matchMode: 'INTERESTS',
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
      interests: ['coding', 'music', 'gaming', 'travel', 'movies'],
    },
  },
  {
    id: 'user-maya',
    email: 'maya@sahrdaya.ac.in',
    profileCompleted: true,
    profile: {
      displayName: 'Maya Joseph',
      year: 2,
      bio: "Biotech sophomore exploring acoustic guitars and photography. Let's exchange Spotify playlists!",
      gender: 'WOMAN',
      showDob: true,
      dateOfBirth: new Date('2005-08-22'),
      intent: 'DATING',
      matchMode: 'INTERESTS',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
      interests: ['music', 'coding', 'photography', 'travel', 'art'],
    },
  },
  {
    id: 'user-akhil',
    email: 'akhil@sahrdaya.ac.in',
    profileCompleted: true,
    profile: {
      displayName: 'Akhil Thomas',
      year: 4,
      bio: 'Final year ECE. Football on weekends, hackathons during weekdays. Looking for great vibes and conversations.',
      gender: 'MAN',
      showDob: false,
      intent: 'FRIENDSHIP',
      matchMode: 'INTERESTS',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      interests: ['football', 'startups', 'coding', 'fitness'],
    },
  },
  {
    id: 'user-niya',
    email: 'niya@sahrdaya.ac.in',
    profileCompleted: true,
    profile: {
      displayName: 'Niya Varghese',
      year: 3,
      bio: 'Design nerd & book lover. Building aesthetic interfaces and searching for coffee recommendations around Kodakara.',
      gender: 'WOMAN',
      showDob: true,
      dateOfBirth: new Date('2004-11-03'),
      intent: 'LIKE_MINDED_FRIEND',
      matchMode: 'INTERESTS',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      interests: ['design', 'books', 'art', 'music'],
    },
  },
  {
    id: 'user-kevin',
    email: 'kevin@sahrdaya.ac.in',
    profileCompleted: true,
    profile: {
      displayName: 'Kevin Mathew',
      year: 1,
      bio: 'First year fresher trying to survive engineering math. Avid anime binge-watcher & competitive gamer.',
      gender: 'MAN',
      showDob: false,
      intent: 'JUST_CHAT',
      matchMode: 'RANDOM',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      interests: ['anime', 'gaming', 'memes', 'movies'],
    },
  },
  {
    id: 'user-ananya',
    email: 'ananya@sahrdaya.ac.in',
    profileCompleted: true,
    profile: {
      displayName: 'Ananya George',
      year: 2,
      bio: 'Classical dance + modern startup enthusiast. Believes in serendipity and good conversations under the campus gulmohar tree.',
      gender: 'WOMAN',
      showDob: false,
      intent: 'DATING',
      matchMode: 'INTERESTS',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
      interests: ['dance', 'startups', 'music', 'travel'],
    },
  },
  {
    id: 'user-rohan',
    email: 'rohan@sahrdaya.ac.in',
    profileCompleted: true,
    profile: {
      displayName: 'Rohan Philip',
      year: 4,
      bio: "Civil engineering senior. Cricket captain & fitness enthusiast. Let's catch up after 4 PM practice.",
      gender: 'MAN',
      showDob: true,
      dateOfBirth: new Date('2003-09-18'),
      intent: 'FRIENDSHIP',
      matchMode: 'RANDOM',
      avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
      interests: ['cricket', 'fitness', 'food', 'travel'],
    },
  },
];

async function main() {
  console.log('🌱 Seeding MATCH@SAHRDAYA database with intentional campus demo records...');

  // 1. Seed Interests Taxonomy
  console.log('Inserting campus interest taxonomy...');
  for (const interest of ALL_INTERESTS) {
    await prisma.interest.upsert({
      where: { id: interest.id },
      update: { name: interest.name, emoji: interest.emoji, category: interest.category },
      create: { id: interest.id, name: interest.name, emoji: interest.emoji, category: interest.category },
    });
  }
  console.log(`✅ Seeded ${ALL_INTERESTS.length} campus interests.`);

  // 2. Seed Verified Sahrdaya Demo Accounts
  console.log('Inserting verified Sahrdaya demo student profiles...');
  for (const demoUser of DEMO_USERS) {
    const user = await prisma.user.upsert({
      where: { email: demoUser.email },
      update: {
        profileCompleted: demoUser.profileCompleted,
      },
      create: {
        id: demoUser.id,
        email: demoUser.email,
        profileCompleted: demoUser.profileCompleted,
      },
    });

    // Create or update profile
    const profile = await prisma.userProfile.upsert({
      where: { userId: user.id },
      update: {
        displayName: demoUser.profile.displayName,
        year: demoUser.profile.year,
        bio: demoUser.profile.bio,
        gender: demoUser.profile.gender,
        dateOfBirth: demoUser.profile.dateOfBirth,
        showDob: demoUser.profile.showDob,
        intent: demoUser.profile.intent,
        matchMode: demoUser.profile.matchMode,
        avatarUrl: demoUser.profile.avatarUrl,
      },
      create: {
        userId: user.id,
        displayName: demoUser.profile.displayName,
        year: demoUser.profile.year,
        bio: demoUser.profile.bio,
        gender: demoUser.profile.gender,
        dateOfBirth: demoUser.profile.dateOfBirth,
        showDob: demoUser.profile.showDob,
        intent: demoUser.profile.intent,
        matchMode: demoUser.profile.matchMode,
        avatarUrl: demoUser.profile.avatarUrl,
      },
    });

    // Link interests
    await prisma.userInterest.deleteMany({
      where: { profileId: profile.id },
    });

    for (const interestId of demoUser.profile.interests) {
      await prisma.userInterest.create({
        data: {
          profileId: profile.id,
          interestId,
        },
      });
    }
  }
  console.log(`✅ Seeded ${DEMO_USERS.length} demo students.`);

  // 3. Seed an initial demo match & conversation between Arjun and Maya
  const arjun = await prisma.user.findUnique({ where: { email: 'arjun@sahrdaya.ac.in' } });
  const maya = await prisma.user.findUnique({ where: { email: 'maya@sahrdaya.ac.in' } });

  if (arjun && maya) {
    const existingMatch = await prisma.match.findFirst({
      where: {
        OR: [
          { userAId: arjun.id, userBId: maya.id },
          { userAId: maya.id, userBId: arjun.id },
        ],
      },
    });

    if (!existingMatch) {
      const match = await prisma.match.create({
        data: {
          userAId: arjun.id,
          userBId: maya.id,
          score: 0.94,
          mode: 'INTERESTS',
          status: 'ACTIVE',
        },
      });

      const conversation = await prisma.conversation.create({
        data: {
          matchId: match.id,
          participantAId: arjun.id,
          participantBId: maya.id,
          unreadCountA: 0,
          unreadCountB: 0,
        },
      });

      await prisma.match.update({
        where: { id: match.id },
        data: { conversationId: conversation.id },
      });

      await prisma.message.createMany({
        data: [
          {
            conversationId: conversation.id,
            senderId: maya.id,
            content: 'Hey Arjun! Saw you like indie music and coding too. Have you listened to the new Thaikkudam Bridge track?',
            isRead: true,
          },
          {
            conversationId: conversation.id,
            senderId: arjun.id,
            content: 'Hey Maya! Yes!! That guitar solo near the middle is incredible. We definitely need to jam sometime at the open amphitheater!',
            isRead: true,
          },
        ],
      });

      console.log('✅ Seeded demo match and conversation between Arjun & Maya.');
    }
  }

  console.log('🎉 Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
