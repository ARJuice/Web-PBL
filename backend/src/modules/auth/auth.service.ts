import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginInput } from './dto/login.input';
import { AuthPayload } from './dto/auth.payload';
import { User } from '../../models/user.model';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly COLLEGE_DOMAIN_REGEX = /^[a-zA-Z0-9._%+-]+@sahrdaya\.ac\.in$/;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  validateCollegeDomain(email: string): boolean {
    return this.COLLEGE_DOMAIN_REGEX.test(email.trim().toLowerCase());
  }

  async login(input: LoginInput): Promise<AuthPayload> {
    const normalizedEmail = input.email.trim().toLowerCase();

    if (!this.validateCollegeDomain(normalizedEmail)) {
      throw new BadRequestException(
        'Authentication restricted to Sahrdaya institutional emails (@sahrdaya.ac.in).',
      );
    }

    this.logger.log(`Authenticating user: ${normalizedEmail}`);

    let dbUser = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: {
        profile: {
          include: {
            interests: {
              include: {
                interest: true,
              },
            },
          },
        },
      },
    });

    if (!dbUser) {
      this.logger.log(`Registering new student account for: ${normalizedEmail}`);
      dbUser = await this.prisma.user.create({
        data: {
          email: normalizedEmail,
          profileCompleted: false,
        },
        include: {
          profile: {
            include: {
              interests: {
                include: {
                  interest: true,
                },
              },
            },
          },
        },
      });
    }

    const payload = { sub: dbUser.id, email: dbUser.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: this.mapUser(dbUser),
    };
  }

  async validateUserById(userId: string): Promise<User> {
    const dbUser = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          include: {
            interests: {
              include: {
                interest: true,
              },
            },
          },
        },
      },
    });

    if (!dbUser) {
      throw new UnauthorizedException('User not found.');
    }

    return this.mapUser(dbUser);
  }

  mapUser(dbUser: any): User {
    return {
      id: dbUser.id,
      email: dbUser.email,
      profileCompleted: dbUser.profileCompleted,
      createdAt: dbUser.createdAt,
      updatedAt: dbUser.updatedAt,
      profile: dbUser.profile
        ? {
            displayName: dbUser.profile.displayName,
            year: dbUser.profile.year,
            bio: dbUser.profile.bio ?? '',
            gender: dbUser.profile.gender,
            showDob: dbUser.profile.showDob,
            dateOfBirth: dbUser.profile.dateOfBirth
              ? dbUser.profile.dateOfBirth.toISOString().split('T')[0]
              : undefined,
            intent: dbUser.profile.intent,
            matchMode: dbUser.profile.matchMode,
            avatarUrl: dbUser.profile.avatarUrl ?? undefined,
            interests: (dbUser.profile.interests || []).map((ui: any) => ui.interest || ui),
          }
        : undefined,
    };
  }
}
