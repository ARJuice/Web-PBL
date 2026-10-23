import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MatchMode, MatchStatus, Gender, Intent } from '../../common/enums';
import { Match } from '../../models/match.model';
import { UserProfile } from '../../models/user-profile.model';

@Injectable()
export class MatchService {
  constructor(private readonly prisma: PrismaService) {}

  async executeMatch(currentUserId: string, overrideMode?: MatchMode): Promise<Match> {
    // 1. Fetch current user with profile and interests
    const currentUser = await this.prisma.user.findUnique({
      where: { id: currentUserId },
      include: {
        profile: {
          include: {
            interests: {
              include: { interest: true },
            },
          },
        },
      },
    });

    if (!currentUser || !currentUser.profileCompleted || !currentUser.profile) {
      throw new BadRequestException('Complete your profile before finding a match');
    }

    const currentProfile = currentUser.profile;
    const userInterestNames = currentProfile.interests.map((ui) => ui.interest.name);
    const userInterestIds = new Set(currentProfile.interests.map((ui) => ui.interestId));

    // 2. Fetch blocked IDs in both directions
    const blocks = await this.prisma.userBlock.findMany({
      where: {
        OR: [{ blockerId: currentUserId }, { blockedId: currentUserId }],
      },
    });
    const blockedUserIds = new Set(
      blocks.map((b) => (b.blockerId === currentUserId ? b.blockedId : b.blockerId))
    );

    // 3. Fetch existing matches involving this user
    const existingMatches = await this.prisma.match.findMany({
      where: {
        OR: [{ userAId: currentUserId }, { userBId: currentUserId }],
      },
    });
    const alreadyMatchedIds = new Set(
      existingMatches.map((m) => (m.userAId === currentUserId ? m.userBId : m.userAId))
    );

    // 4. Query all eligible candidates
    const candidates = await this.prisma.user.findMany({
      where: {
        id: {
          not: currentUserId,
          notIn: Array.from(new Set([...blockedUserIds, ...alreadyMatchedIds])),
        },
        profileCompleted: true,
      },
      include: {
        profile: {
          include: {
            interests: {
              include: { interest: true },
            },
          },
        },
      },
    });

    if (candidates.length === 0) {
      throw new NotFoundException(
        'No new eligible matches available right now. You have connected with all active candidates!'
      );
    }

    // 5. Select mode (override or user's preference)
    const mode = overrideMode || (currentProfile.matchMode as MatchMode) || MatchMode.INTERESTS;
    let chosenCandidate: (typeof candidates)[0];
    let compatibilityScore = 0.5;
    let sharedInterests: string[] = [];

    if (mode === MatchMode.INTERESTS) {
      // Score each candidate
      const scoredCandidates = candidates.map((candidate) => {
        const candProfile = candidate.profile!;
        const candInterestNames = candProfile.interests.map((ui) => ui.interest.name);

        // Find shared interests
        const shared = candInterestNames.filter((name) =>
          userInterestNames.some((uName) => uName.toLowerCase() === name.toLowerCase())
        );

        // Jaccard similarity calculation
        const maxLen = Math.max(userInterestNames.length, candInterestNames.length) || 1;
        let baseScore = shared.length / maxLen;

        // Intent synergy bonus
        if (candProfile.intent === currentProfile.intent) {
          baseScore += 0.1;
        }

        // Campus year proximity bonus
        const yearDiff = Math.abs(candProfile.year - currentProfile.year);
        if (yearDiff <= 1) {
          baseScore += 0.05;
        }

        // Clamp between 0.35 and 0.98
        const finalScore = Number(Math.min(0.98, Math.max(0.35, baseScore)).toFixed(2));

        return { candidate, score: finalScore, shared };
      });

      // Sort descending by compatibility score
      scoredCandidates.sort((a, b) => b.score - a.score);
      const topPick = scoredCandidates[0];
      chosenCandidate = topPick.candidate;
      compatibilityScore = topPick.score;
      sharedInterests = topPick.shared;
    } else {
      // Random serendipity mode
      const randomIndex = Math.floor(Math.random() * candidates.length);
      chosenCandidate = candidates[randomIndex];
      const candInterestNames = chosenCandidate.profile!.interests.map((ui) => ui.interest.name);
      sharedInterests = candInterestNames.filter((name) =>
        userInterestNames.some((uName) => uName.toLowerCase() === name.toLowerCase())
      );
      compatibilityScore = Number((0.4 + Math.random() * 0.45).toFixed(2));
    }

    // 6. Atomically persist Match, Conversation, and Initial Icebreaker Message
    const createdData = await this.prisma.$transaction(async (tx) => {
      // Create Match record
      const match = await tx.match.create({
        data: {
          userAId: currentUserId,
          userBId: chosenCandidate.id,
          score: compatibilityScore,
          mode,
          status: 'ACTIVE',
        },
      });

      // Create Conversation record
      const conversation = await tx.conversation.create({
        data: {
          matchId: match.id,
          participantAId: currentUserId,
          participantBId: chosenCandidate.id,
          unreadCountA: 0,
          unreadCountB: 1,
          lastMessageAt: new Date(),
        },
      });

      // Update match with conversationId
      await tx.match.update({
        where: { id: match.id },
        data: { conversationId: conversation.id },
      });

      // Create welcoming system message
      await tx.message.create({
        data: {
          conversationId: conversation.id,
          senderId: currentUserId,
          content: `Cupid linked you with ${chosenCandidate.profile!.displayName}! Say hello and break the ice! 🌹`,
        },
      });

      return { match, conversation };
    });

    return this.mapMatchEntity(
      {
        ...createdData.match,
        conversationId: createdData.conversation.id,
      },
      chosenCandidate.profile!,
      chosenCandidate.email,
      sharedInterests
    );
  }

  async getMyMatches(currentUserId: string): Promise<Match[]> {
    const matches = await this.prisma.match.findMany({
      where: {
        OR: [{ userAId: currentUserId }, { userBId: currentUserId }],
        status: { not: 'BLOCKED' },
      },
      include: {
        userA: {
          include: {
            profile: {
              include: { interests: { include: { interest: true } } },
            },
          },
        },
        userB: {
          include: {
            profile: {
              include: { interests: { include: { interest: true } } },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const user = await this.prisma.user.findUnique({
      where: { id: currentUserId },
      include: { profile: { include: { interests: { include: { interest: true } } } } },
    });

    const myInterestNames = user?.profile?.interests.map((ui) => ui.interest.name) || [];

    return matches.map((m) => {
      const isUserA = m.userAId === currentUserId;
      const candidateUser = isUserA ? m.userB : m.userA;
      const candidateProfile = candidateUser.profile!;
      const candidateInterests = candidateProfile.interests.map((ui) => ui.interest.name);
      const shared = candidateInterests.filter((c) =>
        myInterestNames.some((my) => my.toLowerCase() === c.toLowerCase())
      );

      return this.mapMatchEntity(m, candidateProfile, candidateUser.email, shared);
    });
  }

  async getMatchById(currentUserId: string, matchId: string): Promise<Match> {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
      include: {
        userA: {
          include: {
            profile: {
              include: { interests: { include: { interest: true } } },
            },
          },
        },
        userB: {
          include: {
            profile: {
              include: { interests: { include: { interest: true } } },
            },
          },
        },
      },
    });

    if (!match || (match.userAId !== currentUserId && match.userBId !== currentUserId)) {
      throw new NotFoundException(`Match with ID ${matchId} not found`);
    }

    const isUserA = match.userAId === currentUserId;
    const candidateUser = isUserA ? match.userB : match.userA;

    return this.mapMatchEntity(match, candidateUser.profile!, candidateUser.email, []);
  }

  private mapMatchEntity(
    m: any,
    candidateProfile: any,
    candidateEmail: string,
    sharedInterests: string[]
  ): Match {
    return {
      id: m.id,
      userAId: m.userAId,
      userBId: m.userBId,
      candidateEmail,
      candidateProfile: {
        displayName: candidateProfile.displayName,
        year: candidateProfile.year,
        bio: candidateProfile.bio || undefined,
        gender: candidateProfile.gender as Gender,
        showDob: candidateProfile.showDob,
        dateOfBirth: candidateProfile.dateOfBirth
          ? candidateProfile.dateOfBirth.toISOString().split('T')[0]
          : undefined,
        intent: candidateProfile.intent as Intent,
        matchMode: candidateProfile.matchMode as MatchMode,
        avatarUrl: candidateProfile.avatarUrl || undefined,
        interests: candidateProfile.interests
          ? candidateProfile.interests.map((ui: any) => ui.interest || ui)
          : [],
      },
      score: Number(m.score),
      sharedInterests,
      mode: m.mode as MatchMode,
      status: m.status as MatchStatus,
      conversationId: m.conversationId || '',
      createdAt: m.createdAt,
    };
  }
}
