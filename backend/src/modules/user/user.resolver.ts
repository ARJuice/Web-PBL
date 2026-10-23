import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../../models/user.model';
import { Interest } from '../../models/interest.model';
import { UpdateProfileInput } from './dto/update-profile.input';
import { MatchMode } from '../../common/enums';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [Interest], { description: 'Get all available campus interests taxonomy' })
  async allInterests(): Promise<Interest[]> {
    return this.userService.getAllInterests();
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => User, { description: 'Find student profile by User ID' })
  async user(@Args('id', { type: () => ID }) id: string): Promise<User> {
    return this.userService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => User, { description: 'Complete or update student onboarding profile' })
  async updateProfile(
    @CurrentUser() user: any,
    @Args('input') input: UpdateProfileInput,
  ): Promise<User> {
    return this.userService.updateProfile(user.id, input);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => User, { description: 'Quickly update selected student interests' })
  async updateInterests(
    @CurrentUser() user: any,
    @Args('interestIds', { type: () => [String] }) interestIds: string[],
  ): Promise<User> {
    return this.userService.updateInterests(user.id, interestIds);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => User, { description: 'Toggle matchmaking mode between INTERESTS and RANDOM' })
  async setMatchMode(
    @CurrentUser() user: any,
    @Args('mode', { type: () => MatchMode }) mode: MatchMode,
  ): Promise<User> {
    return this.userService.setMatchMode(user.id, mode);
  }
}
