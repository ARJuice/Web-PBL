import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Interest {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  emoji!: string;

  @Field({ nullable: true })
  category?: string;
}
