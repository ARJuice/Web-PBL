import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Message } from '../../models/message.model';
import { Conversation } from '../../models/conversation.model';
import { SendMessageInput } from './dto/send-message.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => Conversation)
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [Conversation], { description: 'Retrieve all active conversation channels for current user' })
  async myConversations(@CurrentUser() user: any): Promise<Conversation[]> {
    return this.chatService.getMyConversations(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Message], { description: 'Retrieve message history for a conversation thread' })
  async messages(
    @CurrentUser() user: any,
    @Args('conversationId', { type: () => ID }) conversationId: string,
    @Args('limit', { type: () => Int, defaultValue: 50 }) limit: number,
    @Args('offset', { type: () => Int, defaultValue: 0 }) offset: number,
  ): Promise<Message[]> {
    return this.chatService.getMessages(user.id, conversationId, limit, offset);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Message, { description: 'Send a message within an active conversation thread' })
  async sendMessage(
    @CurrentUser() user: any,
    @Args('input') input: SendMessageInput,
  ): Promise<Message> {
    return this.chatService.sendMessage(user.id, input);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean, { description: 'Mark incoming messages in a conversation as read' })
  async markConversationAsRead(
    @CurrentUser() user: any,
    @Args('conversationId', { type: () => ID }) conversationId: string,
  ): Promise<boolean> {
    return this.chatService.markConversationAsRead(user.id, conversationId);
  }
}
