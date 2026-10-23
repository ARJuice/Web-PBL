import { Resolver, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SafetyService } from './safety.service';
import { ReportUserInput } from './dto/report-user.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver()
export class SafetyResolver {
  constructor(private readonly safetyService: SafetyService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean, { description: 'Block a student and end active matchmaking connection' })
  async blockUser(
    @CurrentUser() user: any,
    @Args('targetUserId', { type: () => ID }) targetUserId: string,
    @Args('reason', { nullable: true }) reason?: string,
  ): Promise<boolean> {
    return this.safetyService.blockUser(user.id, targetUserId, reason);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean, { description: 'File a conduct or safety report against a student' })
  async reportUser(
    @CurrentUser() user: any,
    @Args('input') input: ReportUserInput,
  ): Promise<boolean> {
    return this.safetyService.reportUser(user.id, input);
  }
}
