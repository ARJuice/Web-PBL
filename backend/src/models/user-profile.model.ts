import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Gender, Intent, MatchMode } from '../common/enums';
import { Interest } from './interest.model';

@ObjectType()
export class UserProfile {
  @Field()
  displayName!: string;

  @Field(() => Int)
  year!: number;

  @Field({ nullable: true })
  bio?: string;

  @Field(() => Gender)
  gender!: Gender;

  @Field()
  showDob!: boolean;

  @Field({ nullable: true })
  dateOfBirth?: string;

  @Field(() => Intent)
  intent!: Intent;

  @Field(() => MatchMode)
  matchMode!: MatchMode;

  @Field(() => [Interest])
  interests!: Interest[];

  @Field({ nullable: true })
  avatarUrl?: string;
}
