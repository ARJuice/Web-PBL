import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SendMessageInput } from './dto/send-message.input';
import { Message } from '../../models/message.model';
import { Conversation } from '../../models/conversation.model';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async sendMessage(currentUserId: string, input: SendMessageInput): Promise<Message> {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: input.conversationId },
      include: { match: true },
    });

    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${input.conversationId} not found`);
    }

    const isParticipantA = conversation.participantAId === currentUserId;
    const isParticipantB = conversation.participantBId === currentUserId;

    if (!isParticipantA && !isParticipantB) {
      throw new ForbiddenException('You are not authorized to send messages in this conversation');
    }

    const otherParticipantId = isParticipantA
      ? conversation.participantBId
      : conversation.participantAId;

    // Check if communication is blocked
    const isBlocked = await this.prisma.userBlock.findFirst({
      where: {
        OR: [
          { blockerId: currentUserId, blockedId: otherParticipantId },
          { blockerId: otherParticipantId, blockedId: currentUserId },
        ],
      },
    });

    if (isBlocked) {
      throw new ForbiddenException('Cannot send message: one or both users have been blocked');
    }

    // Atomically create message and update conversation stats
    const message = await this.prisma.$transaction(async (tx) => {
      const createdMessage = await tx.message.create({
        data: {
          conversationId: input.conversationId,
          senderId: currentUserId,
          content: input.content.trim(),
        },
      });

      await tx.conversation.update({
        where: { id: input.conversationId },
        data: {
          lastMessageAt: new Date(),
          unreadCountA: isParticipantB ? { increment: 1 } : undefined,
          unreadCountB: isParticipantA ? { increment: 1 } : undefined,
        },
      });

      return createdMessage;
    });

    return {
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      content: message.content,
      isRead: message.isRead,
      createdAt: message.createdAt,
    };
  }

  async getMyConversations(currentUserId: string): Promise<Conversation[]> {
    const rawConversations = await this.prisma.conversation.findMany({
      where: {
        OR: [{ participantAId: currentUserId }, { participantBId: currentUserId }],
      },
      include: {
        match: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    });

    // Resolve other user profiles for each conversation
    const otherUserIds = rawConversations.map((c) =>
      c.participantAId === currentUserId ? c.participantBId : c.participantAId
    );

    const otherUsers = await this.prisma.user.findMany({
      where: { id: { in: otherUserIds } },
      include: {
        profile: {
          include: {
            interests: { include: { interest: true } },
          },
        },
      },
    });

    const otherUsersMap = new Map(otherUsers.map((u) => [u.id, u]));

    // Fetch current user's interests for shared comparison
    const currentUser = await this.prisma.user.findUnique({
      where: { id: currentUserId },
      include: {
        profile: {
          include: { interests: { include: { interest: true } } },
        },
      },
    });
    const myInterestNames = currentUser?.profile?.interests.map((ui) => ui.interest.name) || [];

    return rawConversations.map((c) => {
      const isParticipantA = c.participantAId === currentUserId;
      const otherId = isParticipantA ? c.participantBId : c.participantAId;
      const otherUser = otherUsersMap.get(otherId);
      const otherProfile = otherUser?.profile;

      const candInterests = otherProfile?.interests.map((ui) => ui.interest.name) || [];
      const shared = candInterests.filter((cand) =>
        myInterestNames.some((my) => my.toLowerCase() === cand.toLowerCase())
      );

      const latestMsg = c.messages[0];

      return {
        id: c.id,
        matchId: c.matchId,
        otherUser: {
          id: otherId,
          displayName: otherProfile?.displayName || 'Student',
          avatarUrl: otherProfile?.avatarUrl || undefined,
          year: otherProfile?.year || 1,
          bio: otherProfile?.bio || undefined,
          sharedInterests: shared,
        },
        lastMessage: latestMsg
          ? {
              id: latestMsg.id,
              conversationId: latestMsg.conversationId,
              senderId: latestMsg.senderId,
              content: latestMsg.content,
              isRead: latestMsg.isRead,
              createdAt: latestMsg.createdAt,
            }
          : undefined,
        unreadCount: isParticipantA ? c.unreadCountA : c.unreadCountB,
        lastMessageAt: c.lastMessageAt || c.createdAt,
        createdAt: c.createdAt,
      };
    });
  }

  async getMessages(
    currentUserId: string,
    conversationId: string,
    limit = 50,
    offset = 0
  ): Promise<Message[]> {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${conversationId} not found`);
    }

    if (
      conversation.participantAId !== currentUserId &&
      conversation.participantBId !== currentUserId
    ) {
      throw new ForbiddenException('Not authorized to view messages in this conversation');
    }

    const messages = await this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      take: Math.min(limit, 100),
      skip: offset,
    });

    return messages.map((m) => ({
      id: m.id,
      conversationId: m.conversationId,
      senderId: m.senderId,
      content: m.content,
      isRead: m.isRead,
      createdAt: m.createdAt,
    }));
  }

  async markConversationAsRead(currentUserId: string, conversationId: string): Promise<boolean> {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) return false;

    const isParticipantA = conversation.participantAId === currentUserId;
    const isParticipantB = conversation.participantBId === currentUserId;

    if (!isParticipantA && !isParticipantB) return false;

    await this.prisma.$transaction(async (tx) => {
      await tx.conversation.update({
        where: { id: conversationId },
        data: {
          unreadCountA: isParticipantA ? 0 : undefined,
          unreadCountB: isParticipantB ? 0 : undefined,
        },
      });

      // Mark messages received by current user as read
      await tx.message.updateMany({
        where: {
          conversationId,
          senderId: { not: currentUserId },
          isRead: false,
        },
        data: { isRead: true },
      });
    });

    return true;
  }
}
