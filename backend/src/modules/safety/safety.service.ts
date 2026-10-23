import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ReportUserInput } from './dto/report-user.input';

@Injectable()
export class SafetyService {
  constructor(private readonly prisma: PrismaService) {}

  async blockUser(currentUserId: string, targetUserId: string, reason?: string): Promise<boolean> {
    if (currentUserId === targetUserId) {
      throw new BadRequestException('You cannot block your own student account');
    }

    await this.prisma.$transaction(async (tx) => {
      // Create block record
      await tx.userBlock.upsert({
        where: {
          blockerId_blockedId: {
            blockerId: currentUserId,
            blockedId: targetUserId,
          },
        },
        create: {
          blockerId: currentUserId,
          blockedId: targetUserId,
          reason,
        },
        update: {
          reason,
        },
      });

      // Update match status to BLOCKED in either direction
      await tx.match.updateMany({
        where: {
          OR: [
            { userAId: currentUserId, userBId: targetUserId },
            { userAId: targetUserId, userBId: currentUserId },
          ],
        },
        data: {
          status: 'BLOCKED',
        },
      });
    });

    return true;
  }

  async reportUser(currentUserId: string, input: ReportUserInput): Promise<boolean> {
    if (currentUserId === input.targetUserId) {
      throw new BadRequestException('You cannot report yourself');
    }

    await this.prisma.userReport.create({
      data: {
        reporterId: currentUserId,
        targetId: input.targetUserId,
        reason: input.reason,
        note: input.note?.trim() || null,
      },
    });

    return true;
  }
}
