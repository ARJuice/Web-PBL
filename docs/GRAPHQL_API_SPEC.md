# MATCH@SAHRDAYA — GraphQL API Specification

> **Backend Architecture:** NestJS + Apollo Server (`@nestjs/graphql`)  
> **API Paradigm:** Code-First GraphQL with TypeScript decorators  
> **Endpoint:** `POST /graphql` (HTTP Operations) & `ws://.../graphql` (Subscriptions)  
> **Compliance:** Strict adherence to `SKILL.md` thin resolvers, server-side validation, and security mandates.  

---

## 1. Architecture & Design Principles (SKILL.md Mandates)

Per `SKILL.md` engineering requirements:

1. **Workflow-Driven Schema:**
   - Schema, queries, and mutations are defined strictly around actual user workflows (Authentication, Profile Onboarding, Cupid Matching, Real-time Chat, Moderation).
2. **Thin Resolvers, Rich Services:**
   - Resolvers only extract parameters and identity from the execution context (`@CurrentUser()`).
   - All matchmaking algorithms, similarity scoring, database operations, and side-effects reside entirely in NestJS injectable services.
3. **Server-Side Validation & Security:**
   - All untrusted input is validated on the server using `class-validator` and `class-transformer`.
   - Handling of missing records, duplicate matches, invalid input, permission failures, and dependency errors occurs cleanly without exposing secrets or internal stack traces.
4. **Server-Side Access Control:**
   - Authorization is enforced by NestJS `AuthGuard` on every sensitive query and mutation. Hiding UI controls on the frontend does not substitute for server-side authorization.

---

## 2. Complete GraphQL Schema Definition (SDL)

```graphql
"""
ISO-8601 compliant DateTime scalar
"""
scalar DateTime

# ==============================================================================
# ENUMS
# ==============================================================================

enum Gender {
  MAN
  WOMAN
  NON_BINARY
  PREFER_NOT_TO_SAY
}

enum Intent {
  DATING
  FRIENDSHIP
  PARTNER
  LIKE_MINDED_FRIEND
  JUST_CHAT
}

enum MatchMode {
  INTERESTS
  RANDOM
}

enum MatchStatus {
  ACTIVE
  BLOCKED
  ENDED
}

enum ReportReason {
  SPAM
  HARASSMENT
  INAPPROPRIATE_CONTENT
  FAKE_PROFILE
  OTHER
}

# ==============================================================================
# OBJECT TYPES
# ==============================================================================

type Interest {
  id: ID!
  name: String!
  emoji: String!
  category: String
}

type UserProfile {
  displayName: String!
  year: Int!
  bio: String!
  gender: Gender!
  showDob: Boolean!
  dateOfBirth: String
  intent: Intent!
  matchMode: MatchMode!
  interests: [Interest!]!
  avatarUrl: String
}

type User {
  id: ID!
  email: String!
  profileCompleted: Boolean!
  profile: UserProfile
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Match {
  id: ID!
  userA: User!
  userB: User!
  candidateProfile: UserProfile!
  candidateEmail: String!
  score: Float!
  sharedInterests: [String!]!
  mode: MatchMode!
  status: MatchStatus!
  conversationId: ID!
  createdAt: DateTime!
}

type Message {
  id: ID!
  conversationId: ID!
  senderId: ID!
  sender: User!
  content: String!
  isRead: Boolean!
  createdAt: DateTime!
}

type ConversationParticipant {
  id: ID!
  displayName: String!
  avatarUrl: String
  year: Int!
  bio: String
  sharedInterests: [String!]!
}

type Conversation {
  id: ID!
  matchId: ID!
  otherUser: ConversationParticipant!
  lastMessage: Message
  unreadCount: Int!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type AffiliateProduct {
  id: ID!
  name: String!
  description: String!
  price: String!
  imageUrl: String!
  affiliateUrl: String!
  tag: String!
}

type AuthPayload {
  accessToken: String!
  user: User!
}

# ==============================================================================
# INPUT TYPES (Validated with class-validator)
# ==============================================================================

input LoginInput {
  email: String!
}

input InterestInput {
  id: String!
  name: String!
  emoji: String!
  category: String
}

input UpdateProfileInput {
  displayName: String!
  year: Int!
  bio: String!
  gender: Gender!
  showDob: Boolean!
  dateOfBirth: String
  intent: Intent!
  matchMode: MatchMode!
  interests: [InterestInput!]!
  avatarUrl: String
}

input SendMessageInput {
  conversationId: ID!
  content: String!
}

input ReportUserInput {
  targetUserId: ID!
  reason: ReportReason!
  note: String
}

# ==============================================================================
# QUERIES
# ==============================================================================

type Query {
  """
  Retrieve currently authenticated user identity and profile
  """
  me: User!

  """
  List all active and past matches for the current user
  """
  myMatches: [Match!]!

  """
  Retrieve specific match by identifier
  """
  match(id: ID!): Match

  """
  List all active conversations with unread counts and last message previews
  """
  myConversations: [Conversation!]!

  """
  Fetch messages within a specific conversation thread with pagination
  """
  messages(conversationId: ID!, limit: Int = 50, offset: Int = 0): [Message!]!

  """
  List available interests database for profile selection
  """
  allInterests: [Interest!]!

  """
  List curated Valentine campus affiliate products
  """
  affiliateProducts: [AffiliateProduct!]!
}

# ==============================================================================
# MUTATIONS
# ==============================================================================

type Mutation {
  """
  Authenticate with college email address (@sahrdaya.ac.in)
  """
  login(input: LoginInput!): AuthPayload!

  """
  Update or complete student profile
  """
  updateProfile(input: UpdateProfileInput!): User!

  """
  Quickly update selected student interests from modal
  """
  updateInterests(interestIds: [String!]!): User!

  """
  Toggle preferred matchmaking algorithm mode
  """
  setMatchMode(mode: MatchMode!): User!

  """
  Execute Cupid matchmaking algorithm to find an eligible partner
  """
  executeMatch(overrideMode: MatchMode): Match

  """
  Send a message within an active conversation thread
  """
  sendMessage(input: SendMessageInput!): Message!

  """
  Mark messages within a conversation as read
  """
  markConversationAsRead(conversationId: ID!): Boolean!

  """
  Block a user and terminate the active match
  """
  blockUser(targetUserId: ID!, reason: String): Boolean!

  """
  File a student safety or code of conduct report
  """
  reportUser(input: ReportUserInput!): Boolean!
}

# ==============================================================================
# SUBSCRIPTIONS (Live Real-Time Events)
# ==============================================================================

type Subscription {
  """
  Receive live incoming messages for an active conversation
  """
  messageReceived(conversationId: ID!): Message!

  """
  Receive live notification when Cupid finds a new match
  """
  newMatchFound: Match!

  """
  Live partner typing state
  """
  partnerTyping(conversationId: ID!): Boolean!
}
```

---

## 3. Server-Side Input Validation DTOs

All mutations are backed by NestJS DTO classes with `class-validator` annotations:

```typescript
// backend/src/modules/auth/dto/login.input.ts
import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, Matches } from 'class-validator';

@InputType()
export class LoginInput {
  @Field()
  @IsEmail({}, { message: 'Must be a valid email format' })
  @Matches(/^[a-zA-Z0-9._%+-]+@sahrdaya\.ac\.in$/, {
    message: 'Authentication restricted to @sahrdaya.ac.in college addresses',
  })
  email: string;
}

// backend/src/modules/chat/dto/send-message.input.ts
import { InputType, Field, ID } from '@nestjs/graphql';
import { IsUUID, IsNotEmpty, MaxLength } from 'class-validator';

@InputType()
export class SendMessageInput {
  @Field(() => ID)
  @IsUUID('4', { message: 'Invalid conversation identifier' })
  conversationId: string;

  @Field()
  @IsNotEmpty({ message: 'Message content cannot be blank' })
  @MaxLength(2000, { message: 'Message exceeds maximum length of 2000 characters' })
  content: string;
}
```

---

## 4. Apollo Server Error Masking & Formatting

To prevent leaking sensitive internal stack traces or database connection details, Apollo Server formats errors in `backend/src/app.module.ts`:

```typescript
GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  autoSchemaFile: true,
  formatError: (formattedError, error: any) => {
    // Log complete internal error to Winston / Sentry
    winstonLogger.error('GraphQL Error', { error });

    // Sanitize message for client consumption
    return {
      message: formattedError.message,
      code: formattedError.extensions?.code || 'INTERNAL_SERVER_ERROR',
      locations: formattedError.locations,
      path: formattedError.path,
    };
  },
})
```

---

## 5. Machine-Readable Error Codes

| Error Code | HTTP Status | Trigger Scenario |
|---|---|---|
| `UNAUTHENTICATED` | 401 | Missing, malformed, or expired Bearer token |
| `FORBIDDEN` | 403 | Attempting to read another student's conversation or private data |
| `INVALID_COLLEGE_DOMAIN` | 400 | Email does not end with `@sahrdaya.ac.in` |
| `PROFILE_INCOMPLETE` | 400 | Student attempted to find a match before completing their profile |
| `NO_ELIGIBLE_MATCHES` | 404 | All candidates currently matched, blocked, or unavailable |
| `USER_BLOCKED` | 403 | Attempting to message a blocked user |
| `BAD_USER_INPUT` | 400 | DTO validation failed (e.g. blank message, invalid year) |
