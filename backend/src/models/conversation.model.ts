import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Message } from './message.model';

@ObjectType()
export class ConversationParticipant {
  @Field(() => ID)
  id!: string;

  @Field()
  displayName!: string;

  @Field({ nullable: true })
  avatarUrl?: string;

  @Field(() => Int)
  year!: number;

  @Field({ nullable: true })
  bio?: string;

  @Field(() => [String])
  sharedInterests!: string[];
}

@ObjectType()
export class Conversation {
  @Field(() => ID)
  id!: string;

  @Field()
  matchId!: string;

  @Field(() => ConversationParticipant)
  otherUser!: ConversationParticipant;

  @Field(() => Message, { nullable: true })
  lastMessage?: Message;

  @Field(() => Int)
  unreadCount!: number;

  @Field(() => Date)
  lastMessageAt!: Date;

  @Field(() => Date)
  createdAt!: Date;
}
