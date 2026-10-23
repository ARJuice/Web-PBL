import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Message {
  @Field(() => ID)
  id!: string;

  @Field()
  conversationId!: string;

  @Field()
  senderId!: string;

  @Field()
  content!: string;

  @Field()
  isRead!: boolean;

  @Field(() => Date)
  createdAt!: Date;
}
