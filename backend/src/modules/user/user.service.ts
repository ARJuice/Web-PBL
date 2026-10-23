import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateProfileInput } from './dto/update-profile.input';
import { MatchMode, Gender, Intent } from '../../common/enums';
import { User } from '../../models/user.model';
import { Interest } from '../../models/interest.model';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllInterests(): Promise<Interest[]> {
    return this.prisma.interest.findMany({
      orderBy: { category: 'asc' },
    });
  }

  async findById(userId: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
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

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.mapUserEntity(user);
  }

  async updateProfile(userId: string, input: UpdateProfileInput): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Verify all interest IDs exist in the taxonomy
    const availableInterests = await this.prisma.interest.findMany({
      where: { id: { in: input.interestIds } },
    });

    if (availableInterests.length === 0) {
      throw new BadRequestException('At least one valid campus interest must be selected');
    }

    // Upsert Profile and connect interests inside a transaction
    await this.prisma.$transaction(async (tx) => {
      let profileId = user.profile?.id;

      if (profileId) {
        // Update existing profile
        await tx.userProfile.update({
          where: { id: profileId },
          data: {
            displayName: input.displayName.trim(),
            year: input.year,
            bio: input.bio?.trim() || null,
            gender: input.gender,
            showDob: input.showDob,
            dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : null,
            intent: input.intent,
            matchMode: input.matchMode,
            avatarUrl: input.avatarUrl || null,
          },
        });

        // Clean out existing interests
        await tx.userInterest.deleteMany({
          where: { profileId },
        });
      } else {
        // Create new profile
        const newProfile = await tx.userProfile.create({
          data: {
            userId: user.id,
            displayName: input.displayName.trim(),
            year: input.year,
            bio: input.bio?.trim() || null,
            gender: input.gender,
            showDob: input.showDob,
            dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : null,
            intent: input.intent,
            matchMode: input.matchMode,
            avatarUrl: input.avatarUrl || null,
          },
        });
        profileId = newProfile.id;
      }

      // Insert selected interests
      const userInterestsData = input.interestIds.map((interestId) => ({
        profileId: profileId!,
        interestId,
      }));

      await tx.userInterest.createMany({
        data: userInterestsData,
        skipDuplicates: true,
      });

      // Mark user profile as completed
      await tx.user.update({
        where: { id: userId },
        data: { profileCompleted: true },
      });
    });

    return this.findById(userId);
  }

  async updateInterests(userId: string, interestIds: string[]): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      throw new BadRequestException('Must complete profile before updating interests');
    }

    const validInterests = await this.prisma.interest.findMany({
      where: { id: { in: interestIds } },
    });

    if (validInterests.length === 0) {
      throw new BadRequestException('Please select at least one valid interest');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.userInterest.deleteMany({
        where: { profileId: user.profile!.id },
      });

      await tx.userInterest.createMany({
        data: interestIds.map((id) => ({
          profileId: user.profile!.id,
          interestId: id,
        })),
        skipDuplicates: true,
      });
    });

    return this.findById(userId);
  }

  async setMatchMode(userId: string, mode: MatchMode): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      throw new BadRequestException('Profile must exist to change matchmaking mode');
    }

    await this.prisma.userProfile.update({
      where: { id: user.profile.id },
      data: { matchMode: mode },
    });

    return this.findById(userId);
  }

  public mapUserEntity(user: any): User {
    return {
      id: user.id,
      email: user.email,
      profileCompleted: user.profileCompleted,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      profile: user.profile
        ? {
            displayName: user.profile.displayName,
            year: user.profile.year,
            bio: user.profile.bio || undefined,
            gender: user.profile.gender as Gender,
            showDob: user.profile.showDob,
            dateOfBirth: user.profile.dateOfBirth
              ? user.profile.dateOfBirth.toISOString().split('T')[0]
              : undefined,
            intent: user.profile.intent as Intent,
            matchMode: user.profile.matchMode as MatchMode,
            avatarUrl: user.profile.avatarUrl || undefined,
            interests: user.profile.interests
              ? user.profile.interests.map((ui: any) => ui.interest || ui)
              : [],
          }
        : undefined,
    };
  }
}
