# MATCH@SAHRDAYA — Developer Setup & Engineering Standards

> **Operational Guidelines:** Compliant with `SKILL.md` engineering rules, package manager protocols, and multi-layer verification procedures.

---

## 1. Prerequisites

Ensure your workstation has the following tools installed:

- **Node.js:** v20.x or higher LTS (`node -v`)
- **Package Manager:** `npm` (v10+) or `bun` (uses `bun.lock` / `package-lock.json`)
  - *Rule from SKILL.md:* "Use the repository's package manager and lockfile. Avoid unrelated rewrites, destructive commands, and overwriting user work."
- **Docker & Docker Compose:** Docker Desktop or Docker Engine v24+
- **Git:** v2.38+ with conventional commit conventions
- *(For Phase 5 & 6)* **Minikube & kubectl:** for local Kubernetes verification

---

## 2. Quickstart (Reproducible Fresh Clone Setup)

```bash
# 1. Clone repository
git clone https://github.com/<your-username>/Web-PBL.git
cd Web-PBL

# 2. Configure environment
cp .env.example .env.local

# 3. Install frontend dependencies (respects lockfile)
npm install

# 4. Start local development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 3. Available NPM Scripts

| Command | Action | Verification Role |
|---|---|---|
| `npm run dev` | Starts Next.js development server with hot module reloading on port 3000 | Local feature validation |
| `npm run build` | Compiles production-ready standalone build in `.next/` | Production build verification |
| `npm run start` | Boots production server from compiled build | Production runtime verification |
| `npm run lint` | Runs ESLint 9 flat-config checks across all TypeScript files | Code hygiene gate |
| `npm run type-check` | Executes TypeScript type-checker without emitting output | Type integrity gate |
| `npm run clean` | Cleans Next.js build cache and temporary files | Cache troubleshooting |

---

## 4. Full-Stack Setup with Docker Compose

To run the complete ecosystem (Next.js Frontend + NestJS GraphQL Backend + PostgreSQL Database):

```bash
# Start all containers in detached mode
docker compose up -d --build

# View real-time container logs
docker compose logs -f

# Check container health status
docker compose ps

# Teardown containers and remove volumes
docker compose down -v
```

Services exposed:
- **Web Application:** `http://localhost:3000`
- **GraphQL Playground / API:** `http://localhost:4000/graphql`
- **PostgreSQL Database:** `localhost:5432`

---

## 5. SKILL.md Engineering Rules & Best Practices

### 5.1 Architecture & Separation of Concerns
- **Next.js** handles presentation, responsive layouts, accessible semantics, loading skeletons, and user interaction.
- **NestJS** owns all business logic, validation pipes, authorization guards, and persistence orchestration.
- **GraphQL** exposes typed queries, mutations, and subscriptions.
- **Database** stays strictly behind NestJS services and Prisma repository layers.

### 5.2 Every Visible Control Must Work
- Every visible button, modal, form input, and toggle must perform its intended end-to-end action.
- The UI must implement explicit loading skeletons, empty states, success states, validation errors, and network failure states.

### 5.3 Truthfulness in Deliverables
- Never fabricate features, test results, coverage, security claims, screenshots, integrations, or deployment status.
- If blocked by missing credentials, tools, or environment access, state the blocker and give the most useful next step.

---

## 6. Conventional Commits & Git Workflow

All commits must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat: <description>` — New user-facing feature.
- `fix: <description>` — Bug fix.
- `docs: <description>` — Documentation changes.
- `chore: <description>` — Tooling, dependency, or configuration updates.
- `refactor: <description>` — Code reorganization without functional changes.
- `test: <description>` — Adding or updating test suites.

---

## 7. Troubleshooting & FAQ

### Port Conflicts (3000, 4000, or 5432 already in use)
```bash
# Check process on port 3000 or 4000 (Windows PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess

# Or run on alternate port:
npm run dev -- -p 3001
```

### Database Connection Refused
Ensure PostgreSQL is running locally or via Docker:
```bash
docker compose up -d postgres
```
Verify `DATABASE_URL` in `.env.local` matches the Docker port and credentials.
