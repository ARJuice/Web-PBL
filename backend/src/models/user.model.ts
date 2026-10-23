import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserProfile } from './user-profile.model';

@ObjectType()
export class User {
  @Field(() => ID)
  id!: string;

  @Field()
  email!: string;

  @Field()
  profileCompleted!: boolean;

  @Field(() => UserProfile, { nullable: true })
  profile?: UserProfile;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}
