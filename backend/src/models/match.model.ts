import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { MatchMode, MatchStatus } from '../common/enums';
import { UserProfile } from './user-profile.model';

@ObjectType()
export class Match {
  @Field(() => ID)
  id!: string;

  @Field()
  userAId!: string;

  @Field()
  userBId!: string;

  @Field(() => UserProfile)
  candidateProfile!: UserProfile;

  @Field()
  candidateEmail!: string;

  @Field(() => Float)
  score!: number;

  @Field(() => [String])
  sharedInterests!: string[];

  @Field(() => MatchMode)
  mode!: MatchMode;

  @Field(() => MatchStatus)
  status!: MatchStatus;

  @Field()
  conversationId!: string;

  @Field(() => Date)
  createdAt!: Date;
}
