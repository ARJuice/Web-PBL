import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, MaxLength, IsUUID } from 'class-validator';

@InputType()
export class SendMessageInput {
  @Field(() => ID)
  @IsUUID('all', { message: 'Invalid conversation identifier format' })
  conversationId!: string;

  @Field()
  @IsNotEmpty({ message: 'Message content cannot be blank' })
  @MaxLength(2000, { message: 'Message cannot exceed 2000 characters' })
  content!: string;
}
