# MATCH@SAHRDAYA — GraphQL API Specification

> **Backend Technology:** NestJS + Apollo Server (`@nestjs/graphql`)  
> **API Paradigm:** Code-First GraphQL with TypeGraphQL decorators  
> **Endpoint:** `POST /graphql` (HTTP), `ws://.../graphql` (Subscriptions)  

---

## 1. Architecture & Design Principles

1. **Strict Type Safety:** All GraphQL inputs and types map directly to TypeScript classes using `@nestjs/graphql` decorators.
2. **Authentication via Bearer Token:** Protected queries and mutations require standard HTTP header:
   ```http
   Authorization: Bearer <JWT_ACCESS_TOKEN>
   ```
3. **Thin Resolvers, Rich Services:** Resolvers extract current user context (`@CurrentUser()`) and delegate business logic to injectable NestJS services.
4. **Uniform Error Structure:** GraphQL errors follow standard extensions with machine-readable error codes.

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
# INPUT TYPES
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

## 3. Key Query & Mutation Examples

### 3.1 Authentication
```graphql
mutation StudentLogin($email: String!) {
  login(input: { email: $email }) {
    accessToken
    user {
      id
      email
      profileCompleted
      profile {
        displayName
        year
        matchMode
      }
    }
  }
}
```
**Variables:**
```json
{
  "email": "arjun@sahrdaya.ac.in"
}
```

### 3.2 Execute Matchmaking
```graphql
mutation FindValentinePartner($mode: MatchMode) {
  executeMatch(overrideMode: $mode) {
    id
    score
    sharedInterests
    conversationId
    candidateProfile {
      displayName
      year
      bio
      avatarUrl
      interests {
        name
        emoji
      }
    }
  }
}
```

### 3.3 Send Real-Time Chat Message
```graphql
mutation SendChatMessage($conversationId: ID!, $content: String!) {
  sendMessage(input: { conversationId: $conversationId, content: $content }) {
    id
    content
    createdAt
    sender {
      id
      profile {
        displayName
      }
    }
  }
}
```

---

## 4. Error Handling & HTTP Status Codes

NestJS filters transform application exceptions into uniform GraphQL extensions:

| Error Code | HTTP Equivalent | Description |
|---|---|---|
| `UNAUTHENTICATED` | 401 | Missing or expired JWT token |
| `FORBIDDEN` | 403 | Attempting to access conversation/data belonging to another user |
| `INVALID_COLLEGE_DOMAIN` | 400 | Provided email does not belong to `@sahrdaya.ac.in` |
| `PROFILE_INCOMPLETE` | 400 | Matchmaking attempted before profile completion |
| `NO_ELIGIBLE_MATCHES` | 404 | All candidates already matched, blocked, or unavailable |
| `USER_BLOCKED` | 403 | Communication attempted with a blocked peer |
| `VALIDATION_FAILED` | 422 | Input DTO failed validation constraints |
