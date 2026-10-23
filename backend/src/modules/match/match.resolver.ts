import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { MatchService } from './match.service';
import { Match } from '../../models/match.model';
import { MatchMode } from '../../common/enums';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => Match)
export class MatchResolver {
  constructor(private readonly matchService: MatchService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Match, { description: 'Trigger Cupid matchmaking to pair with an eligible student' })
  async executeMatch(
    @CurrentUser() user: any,
    @Args('overrideMode', { type: () => MatchMode, nullable: true }) overrideMode?: MatchMode,
  ): Promise<Match> {
    return this.matchService.executeMatch(user.id, overrideMode);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Match], { description: 'Retrieve all active matches for the authenticated student' })
  async myMatches(@CurrentUser() user: any): Promise<Match[]> {
    return this.matchService.getMyMatches(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Match, { description: 'Retrieve specific match details by ID' })
  async match(
    @CurrentUser() user: any,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Match> {
    return this.matchService.getMatchById(user.id, id);
  }
}
