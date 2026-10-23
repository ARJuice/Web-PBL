import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthPayload } from './dto/auth.payload';
import { LoginInput } from './dto/login.input';
import { User } from '../../models/user.model';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthPayload, {
    description: 'Authenticate with college email address (@sahrdaya.ac.in)',
  })
  async login(@Args('input') input: LoginInput): Promise<AuthPayload> {
    return this.authService.login(input);
  }

  @Query(() => User, {
    description: 'Retrieve currently authenticated user identity and profile',
  })
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: any): Promise<User> {
    return this.authService.mapUser(user);
  }
}
