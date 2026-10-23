# System Architecture — MATCH@SAHRDAYA

> This document describes the full system architecture for the MATCH@SAHRDAYA platform, covering both the current frontend prototype and the planned full-stack implementation.

---

## Table of Contents

- [1. High-Level Overview](#1-high-level-overview)
- [2. Current Architecture (Frontend Prototype)](#2-current-architecture-frontend-prototype)
- [3. Target Architecture (Full Stack)](#3-target-architecture-full-stack)
- [4. Frontend Architecture](#4-frontend-architecture)
- [5. Backend Architecture](#5-backend-architecture)
- [6. GraphQL API Layer](#6-graphql-api-layer)
- [7. Database Layer](#7-database-layer)
- [8. Authentication & Authorization](#8-authentication--authorization)
- [9. Infrastructure & Deployment](#9-infrastructure--deployment)
- [10. Monitoring & Observability](#10-monitoring--observability)

---

## 1. High-Level Overview

MATCH@SAHRDAYA is a campus-only social matching platform built for Sahrdaya College of Engineering & Technology. The system matches students based on shared interests and enables real-time communication between matched pairs.

```mermaid
graph TB
    subgraph "Client Layer"
        Browser["Browser / PWA"]
    end

    subgraph "Frontend - Next.js"
        SSR["Server-Side Rendering"]
        CSR["Client Components"]
        GQLClient["GraphQL Client"]
    end

    subgraph "API Layer"
        GQL["GraphQL API Gateway"]
    end

    subgraph "Backend - NestJS"
        AuthModule["Auth Module"]
        UserModule["User Module"]
        MatchModule["Match Module"]
        ChatModule["Chat Module"]
        NotifModule["Notification Module"]
    end

    subgraph "Data Layer"
        DB["PostgreSQL"]
        Cache["Redis (Optional)"]
    end

    subgraph "Infrastructure"
        Docker["Docker Containers"]
        K8s["Kubernetes / Minikube"]
        CICD["GitHub Actions CI/CD"]
    end

    subgraph "Monitoring"
        Sentry["Sentry / Error Tracking"]
        Metrics["Prometheus + Grafana"]
        Logs["Structured Logging"]
    end

    Browser --> SSR
    Browser --> CSR
    CSR --> GQLClient
    GQLClient --> GQL
    GQL --> AuthModule
    GQL --> UserModule
    GQL --> MatchModule
    GQL --> ChatModule
    GQL --> NotifModule
    AuthModule --> DB
    UserModule --> DB
    MatchModule --> DB
    ChatModule --> DB
    ChatModule --> Cache
    Docker --> K8s
    NestJS --> Sentry
    NestJS --> Metrics
    NestJS --> Logs
```

---

## 2. Current Architecture (Frontend Prototype)

The current implementation is a **single-page application** exported from Google AI Studio. All logic runs client-side with localStorage for persistence.

```mermaid
graph LR
    subgraph "Browser"
        Page["page.tsx (God Component)"]
        Components["React Components"]
        Storage["lib/storage.ts"]
        MockData["lib/mock-data.ts"]
        LS["localStorage"]
    end

    Page --> Components
    Page --> Storage
    Storage --> MockData
    Storage --> LS
```

### Current Limitations

| Area | Limitation |
|------|-----------|
| **State Management** | Single god component (`page.tsx`) holds all state — ~460 lines |
| **Data Persistence** | localStorage only — no server, no database |
| **Authentication** | Email-only, no password, no token verification |
| **Matchmaking** | Client-side algorithm — easy to manipulate |
| **Chat** | Simulated auto-replies with `setTimeout` — not real-time |
| **Multi-user** | "Switch user" feature for testing, not real sessions |
| **Routing** | State-based view switching, not URL-based routing |

---

## 3. Target Architecture (Full Stack)

```mermaid
graph TB
    subgraph "Client Tier"
        NextJS["Next.js 15 (App Router)"]
        Apollo["Apollo Client / urql"]
    end

    subgraph "API Tier"
        NestGQL["NestJS + GraphQL"]
        Guards["Auth Guards"]
        Pipes["Validation Pipes"]
    end

    subgraph "Service Tier"
        AuthSvc["AuthService"]
        UserSvc["UserService"]
        MatchSvc["MatchService"]
        ChatSvc["ChatService"]
        NotifSvc["NotificationService"]
    end

    subgraph "Data Tier"
        PG["PostgreSQL"]
        TypeORM["TypeORM / Prisma"]
    end

    NextJS --> Apollo
    Apollo --> NestGQL
    NestGQL --> Guards
    NestGQL --> Pipes
    Guards --> AuthSvc
    NestGQL --> UserSvc
    NestGQL --> MatchSvc
    NestGQL --> ChatSvc
    NestGQL --> NotifSvc
    AuthSvc --> TypeORM
    UserSvc --> TypeORM
    MatchSvc --> TypeORM
    ChatSvc --> TypeORM
    TypeORM --> PG
```

---

## 4. Frontend Architecture

### Directory Structure (Planned)

```
app/
├── (auth)/
│   ├── login/page.tsx
│   └── register/page.tsx
├── (main)/
│   ├── dashboard/page.tsx
│   ├── chat/
│   │   ├── page.tsx
│   │   └── [conversationId]/page.tsx
│   ├── match/page.tsx
│   ├── profile/page.tsx
│   └── settings/page.tsx
├── layout.tsx
├── page.tsx              # Landing page
└── globals.css

components/
├── features/
│   ├── auth/             # Login, Register components
│   ├── chat/             # Chat UI components
│   ├── dashboard/        # Dashboard widgets
│   ├── matching/         # Matching flow components
│   ├── onboarding/       # Profile setup wizard
│   └── profile/          # Profile display/edit
├── layout/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── Sidebar.tsx
├── shared/
│   ├── Toast.tsx
│   ├── Modal.tsx
│   └── LoadingSpinner.tsx
└── ui/
    ├── Button.tsx
    ├── Input.tsx
    ├── Card.tsx
    └── CupidEmblem.tsx
```

### State Management Strategy

| Concern | Solution |
|---------|----------|
| Server state (users, matches, messages) | Apollo Client cache / React Query |
| Auth state | React Context + JWT token |
| UI state (modals, toasts) | React `useState` / Zustand |
| Form state | React Hook Form |
| URL state | Next.js App Router |

### Routing Plan

| Route | Component | Auth Required |
|-------|-----------|:---:|
| `/` | Landing page | ❌ |
| `/login` | Login form | ❌ |
| `/register` | Registration | ❌ |
| `/onboarding` | Profile setup wizard | ✅ |
| `/dashboard` | Main dashboard | ✅ |
| `/match` | Matching screen | ✅ |
| `/chat` | Conversation list | ✅ |
| `/chat/[id]` | Chat thread | ✅ |
| `/profile` | User profile | ✅ |
| `/settings` | Settings | ✅ |

---

## 5. Backend Architecture

### NestJS Module Structure

```mermaid
graph TB
    subgraph "NestJS Application"
        AppModule["AppModule"]
        
        subgraph "Core Modules"
            AuthModule["AuthModule"]
            UserModule["UserModule"]
            MatchModule["MatchModule"]
            ChatModule["ChatModule"]
        end

        subgraph "Shared"
            DatabaseModule["DatabaseModule"]
            ConfigModule["ConfigModule"]
            LoggingModule["LoggingModule"]
        end
    end

    AppModule --> AuthModule
    AppModule --> UserModule
    AppModule --> MatchModule
    AppModule --> ChatModule
    AppModule --> DatabaseModule
    AppModule --> ConfigModule
    AppModule --> LoggingModule

    AuthModule --> DatabaseModule
    UserModule --> DatabaseModule
    MatchModule --> DatabaseModule
    ChatModule --> DatabaseModule
```

### Module Responsibilities

| Module | Responsibility |
|--------|---------------|
| **AuthModule** | JWT auth, login/register, guards, password hashing |
| **UserModule** | Profile CRUD, interest management, avatar uploads |
| **MatchModule** | Matchmaking algorithm, match history, block/report |
| **ChatModule** | Message CRUD, conversation management, typing indicators |
| **DatabaseModule** | TypeORM/Prisma connection, migrations |
| **ConfigModule** | Environment variable validation and access |
| **LoggingModule** | Structured logging, request tracking |

---

## 6. GraphQL API Layer

### Schema Overview

See [`docs/API.md`](./API.md) for the complete GraphQL schema specification.

```graphql
# Key Types
type User { ... }
type Match { ... }
type Conversation { ... }
type Message { ... }

# Key Operations
type Query {
  me: User!
  myMatches: [Match!]!
  myConversations: [Conversation!]!
  messages(conversationId: ID!): [Message!]!
}

type Mutation {
  login(input: LoginInput!): AuthPayload!
  register(input: RegisterInput!): AuthPayload!
  updateProfile(input: UpdateProfileInput!): User!
  findMatch: Match
  sendMessage(input: SendMessageInput!): Message!
  blockUser(userId: ID!): Boolean!
  reportUser(input: ReportInput!): Boolean!
}
```

---

## 7. Database Layer

See [`docs/DATABASE.md`](./DATABASE.md) for the complete schema design.

### Entity Relationship Diagram

```mermaid
erDiagram
    USER ||--o{ USER_INTEREST : has
    USER ||--o{ MATCH : "participates in"
    MATCH ||--|| CONVERSATION : creates
    CONVERSATION ||--o{ MESSAGE : contains
    USER ||--o{ MESSAGE : sends
    USER ||--o{ REPORT : "files/receives"
    USER ||--o{ BLOCK : "blocks/is blocked"
    INTEREST ||--o{ USER_INTEREST : "selected by"

    USER {
        uuid id PK
        varchar email UK
        varchar password_hash
        varchar display_name
        int year
        text bio
        varchar gender
        date date_of_birth
        boolean show_dob
        varchar intent
        varchar match_mode
        varchar avatar_url
        boolean profile_completed
        timestamp created_at
        timestamp updated_at
    }

    INTEREST {
        varchar id PK
        varchar name
        varchar emoji
        varchar category
    }

    USER_INTEREST {
        uuid user_id FK
        varchar interest_id FK
    }

    MATCH {
        uuid id PK
        uuid user_a_id FK
        uuid user_b_id FK
        float score
        varchar mode
        varchar status
        uuid conversation_id FK
        timestamp created_at
    }

    CONVERSATION {
        uuid id PK
        uuid match_id FK
        int unread_count_a
        int unread_count_b
        timestamp created_at
    }

    MESSAGE {
        uuid id PK
        uuid conversation_id FK
        uuid sender_id FK
        text content
        timestamp created_at
    }

    BLOCK {
        uuid id PK
        uuid blocker_id FK
        uuid blocked_id FK
        timestamp created_at
    }

    REPORT {
        uuid id PK
        uuid reporter_id FK
        uuid target_id FK
        varchar reason
        text note
        timestamp created_at
    }
```

---

## 8. Authentication & Authorization

### Auth Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant N as Next.js
    participant A as NestJS Auth
    participant DB as Database

    C->>N: Login form submit
    N->>A: POST /graphql (login mutation)
    A->>DB: Verify credentials
    DB-->>A: User record
    A->>A: Generate JWT
    A-->>N: { accessToken, user }
    N->>N: Store token (httpOnly cookie)
    N-->>C: Redirect to dashboard

    Note over C,N: Subsequent requests
    C->>N: Request protected page
    N->>A: GraphQL query (Authorization: Bearer token)
    A->>A: Validate JWT (AuthGuard)
    A->>DB: Fetch data
    DB-->>A: Data
    A-->>N: Response
    N-->>C: Rendered page
```

### Security Measures

- **Password hashing:** bcrypt with salt rounds
- **JWT tokens:** Short-lived access tokens (15min), refresh tokens (7d)
- **CORS:** Restricted to frontend origin
- **Rate limiting:** Login attempts throttled
- **Input validation:** class-validator on all DTOs
- **SQL injection:** Parameterized queries via ORM
- **XSS:** React's built-in escaping + CSP headers

---

## 9. Infrastructure & Deployment

### Docker Architecture

```mermaid
graph TB
    subgraph "Docker Compose (Development)"
        FE["frontend\n(Next.js)\nPort 3000"]
        BE["backend\n(NestJS)\nPort 4000"]
        DB["postgres\nPort 5432"]
        PG["pgadmin\nPort 5050"]
    end

    FE --> BE
    BE --> DB
    PG --> DB
```

### Kubernetes Architecture

```mermaid
graph TB
    subgraph "Minikube Cluster"
        subgraph "Ingress"
            ING["Nginx Ingress\nController"]
        end

        subgraph "Frontend Pod"
            FE1["Next.js Container"]
        end

        subgraph "Backend Pod"
            BE1["NestJS Container"]
        end

        subgraph "Database"
            PG1["PostgreSQL\nStatefulSet"]
            PVC["PersistentVolumeClaim"]
        end

        subgraph "Monitoring"
            PROM["Prometheus"]
            GRAF["Grafana"]
        end

        ING --> FE1
        ING --> BE1
        BE1 --> PG1
        PG1 --> PVC
        PROM --> BE1
        GRAF --> PROM
    end
```

See [`docs/DEPLOYMENT.md`](./DEPLOYMENT.md) for detailed deployment instructions.

---

## 10. Monitoring & Observability

| Layer | Tool | Purpose |
|-------|------|---------|
| Error tracking | Sentry | Capture and alert on runtime errors |
| Metrics | Prometheus | Collect application and system metrics |
| Dashboards | Grafana | Visualize metrics and set up alerts |
| Logging | Winston/Pino | Structured JSON logging |
| Health checks | NestJS Terminus | `/health` endpoint for K8s probes |

### Key Metrics to Track

- Request latency (p50, p95, p99)
- Error rate by endpoint
- Active users count
- Match success rate
- Message throughput
- Database connection pool usage
- Memory and CPU utilization
