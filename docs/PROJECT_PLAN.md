# MATCH@SAHRDAYA — Comprehensive Project Roadmap & Execution Plan

> **Academic Course Component:** Web Technologies Project  
> **Target Application:** Campus-Exclusive Valentine Matchmaking & Social Discovery Platform  
> **Target Institution:** Sahrdaya College of Engineering & Technology  

---

## 1. Project Background & Problem Statement

### 1.1 Context
In large collegiate environments, students often find it challenging to connect with peers outside their immediate branch, year, or friend circles. Traditional dating and matchmaking platforms are broad, non-exclusive, lack campus safety guarantees, and are not tailored for college student culture and seasonal events (such as Valentine's season).

### 1.2 Proposed Solution: MATCH@SAHRDAYA
A verified, time-bounded, campus-exclusive social matching application that connects students using:
- **Verified college authentication** (`@sahrdaya.ac.in` domain identity validation).
- **Dual Matching Mechanisms:**
  1. *Cupid Matchmaking:* Multi-attribute weighted interest compatibility scoring.
  2. *Serendipity Matchmaking:* Random discovery for meeting unexpected peers.
- **Interactive Matching Experience:** A 10-second animated anticipation sequence with contextual campus picks.
- **Real-Time Communication:** Direct messaging between mutually matched students.
- **Safety & Moderation:** Granular blocking, reporting, and moderation controls to guarantee campus safety.

---

## 2. Technical Stack & Architectural Constraints

Per the course guidelines and `SKILL.md` engineering rules:

| Layer | Requirement | Implementation Choice | Justification |
|---|---|---|---|
| **Frontend** | Next.js with React & Modern CSS | Next.js 15 (App Router), React 19, Tailwind CSS v4, Motion (Framer Motion) | High performance SSR/CSR, fluid animations, campus-themed typography & styling. |
| **Backend** | NestJS | NestJS v10+ with TypeScript | Robust enterprise module architecture, dependency injection, and clean separation of concerns. |
| **API** | GraphQL | Apollo Server / NestJS `@nestjs/graphql` | Strongly typed operations, client-specific queries, zero over-fetching, live subscriptions. |
| **Database** | Relational / Cloud Database | PostgreSQL 16 with Prisma ORM / TypeORM | Relational integrity for user profiles, foreign key constraints for matches/messages, ACID transactions. |
| **Version Control** | Git + GitHub | Conventional Commits, Feature Branching | Standardized collaboration, clear commit history. |
| **Containerization** | Docker | Multi-stage Dockerfiles + Docker Compose | Isolated, reproducible development and production builds. |
| **CI/CD** | GitHub Actions | Automated linting, type-checking, building, container testing | Continuous quality gate before deployment. |
| **Orchestration** | Kubernetes / Minikube | Declarative Pods, Services, Ingress, PersistentVolumes | Local cluster verification and scalable delivery. |
| **Monitoring** | Error & Performance Observability | Sentry (Error Tracking) + Prometheus & Grafana (Metrics) | Real-time health monitoring and traffic observability. |

---

## 3. Phased Implementation Roadmap

```mermaid
gantt
    title MATCH@SAHRDAYA Project Execution Timeline
    dateFormat  YYYY-MM-DD
    section Phase 1: Planning & Setup
    Project Setup & AI Studio Cleanup        :done, p1, 2026-10-24, 1d
    Architecture & Specs Documentation      :active, p2, 2026-10-24, 1d
    section Phase 2: Backend & Database
    NestJS Scaffolding & Module Setup        :p3, after p2, 2d
    PostgreSQL Schema & Prisma Migrations    :p4, after p3, 2d
    GraphQL Schema & Resolvers               :p5, after p4, 3d
    JWT Auth & College Email Verification    :p6, after p5, 2d
    section Phase 3: Frontend Integration
    Next.js Apollo GraphQL Client Setup      :p7, after p6, 2d
    Wire Auth & Onboarding to GraphQL API    :p8, after p7, 2d
    Wire Matching & Chat to Real Backend     :p9, after p8, 3d
    section Phase 4: DevOps & Infrastructure
    Docker Multi-stage Containerization      :p10, after p9, 2d
    Docker Compose Multi-container Setup     :p11, after p10, 1d
    Kubernetes / Minikube Manifests          :p12, after p11, 2d
    section Phase 5: CI/CD & Observability
    GitHub Actions Workflows (Lint/Build/Test):p13, after p12, 2d
    Sentry & Prometheus/Grafana Integration  :p14, after p13, 2d
    section Phase 6: Final Review & Demo
    End-to-End Testing & Hardening           :p15, after p14, 2d
    Final Project Documentation & Report     :p16, after p15, 2d
```

---

### Detailed Milestone Breakdown

#### Phase 1: Repository Hygiene & Foundation (Current Phase)
- [x] Extract and document requirements from project guidelines.
- [x] Clean AI Studio boilerplate (`metadata.json`, HMR hooks, redundant ESLint configs).
- [x] Establish secure, multi-tier `.env.example`.
- [x] Configure `.gitignore` to prevent leaking agent instructions and internal PDFs.
- [x] Create comprehensive architecture document (`docs/ARCHITECTURE.md`).
- [ ] Create detailed GraphQL API specification (`docs/GRAPHQL_API_SPEC.md`).
- [ ] Create relational database schema design (`docs/DATABASE_SCHEMA.md`).
- [ ] Create containerization and Kubernetes deployment guide (`docs/DOCKER_K8S_GUIDE.md`).
- [ ] Create monitoring, error tracking, and CI/CD guide (`docs/MONITORING_CICD.md`).
- [ ] Overhaul root `README.md` for professional portfolio standards.

#### Phase 2: NestJS Backend & Database Construction (Pending User Approval)
- [ ] Scaffold NestJS backend in a clean monorepo or designated service directory (`backend/` or `server/`).
- [ ] Configure TypeORM or Prisma with PostgreSQL.
- [ ] Define User, Profile, Interest, Match, Conversation, Message, and Report entities.
- [ ] Implement database migrations and automated seeding for demo campus users.
- [ ] Implement JWT authentication module with email domain restriction (`@sahrdaya.ac.in`).
- [ ] Build GraphQL resolvers for Auth, Users, Matchmaking, and Chat.

#### Phase 3: Frontend Modernization & API Integration
- [ ] Replace `lib/storage.ts` localStorage mock state with Apollo Client queries & mutations.
- [ ] Convert client-side simulated matchmaking to invoke GraphQL mutation `findMatch`.
- [ ] Convert client-side simulated chat to real-time messaging backed by NestJS GraphQL mutations/subscriptions.
- [ ] Add loading skeletons, network error handling, and session persistence.
- [ ] Validate responsive layouts on mobile, tablet, and desktop viewports.

#### Phase 4: Containerization & Cloud Deployment
- [ ] Create production-ready, multi-stage `Dockerfile` for Next.js frontend (standalone output).
- [ ] Create production-ready, multi-stage `Dockerfile` for NestJS backend.
- [ ] Compose orchestration (`docker-compose.yml`) linking Frontend, Backend, PostgreSQL, and Redis.
- [ ] Develop Kubernetes manifests:
  - `k8s/frontend-deployment.yaml` and `k8s/frontend-service.yaml`
  - `k8s/backend-deployment.yaml` and `k8s/backend-service.yaml`
  - `k8s/postgres-statefulset.yaml` and `k8s/postgres-pvc.yaml`
  - `k8s/ingress.yaml`
- [ ] Validate cluster deployment locally on Minikube.

#### Phase 5: CI/CD & Observability
- [ ] Implement GitHub Actions workflow (`.github/workflows/ci.yml`):
  - Next.js type-check and linting.
  - NestJS compilation, unit tests, and e2e tests.
  - Docker container build verification.
- [ ] Configure Sentry for Next.js and NestJS error tracking.
- [ ] Configure Prometheus metrics exporter in NestJS and Grafana dashboard manifests.

#### Phase 6: Final Evaluation & Demonstration
- [ ] Prepare comprehensive demonstration script showing the full user journey:
  1. Student login via college credentials.
  2. Profile setup with interests and preferences.
  3. Cupid matching with animated wait screen.
  4. Real-time messaging between two active sessions.
  5. User blocking/reporting verification.
  6. Live container/pod status inspection in Minikube.
  7. Sentry error monitoring demonstration.
- [ ] Finalize technical submission report.

---

## 4. Risk Analysis & Mitigation

| Risk | Impact | Likelihood | Mitigation Strategy |
|---|---|---|---|
| **Simulated Chat Transition** | High | Medium | Implement fallback polling query if WebSocket subscriptions face network/proxy restrictions. |
| **Database Migrations in K8s** | Medium | Medium | Use a Kubernetes pre-install Job or container entrypoint script to execute migrations before starting the API server. |
| **Local Memory Usage (Minikube + Docker)** | Medium | High | Optimize resource requests/limits in Kubernetes manifests (`512Mi` limit per pod). |
| **College Domain Validation** | Low | Low | Enforce regex validation at both Next.js UI input and NestJS DTO validation pipes. |

---

## 5. Definition of Done Checklist

Every phase and deliverable is considered complete only when:
- [ ] All code conforms to strict TypeScript compiler standards (`noEmitOnError: true`).
- [ ] No hardcoded secrets, API keys, or credentials exist in the source tree.
- [ ] Each functional module is verified across the complete chain: UI → GraphQL → NestJS Service → Database.
- [ ] Every commit follows conventional commits (`feat:`, `fix:`, `chore:`, `docs:`, `test:`).
- [ ] Automated CI passes without warnings or failures.
