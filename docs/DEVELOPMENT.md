# MATCH@SAHRDAYA — Developer Setup & Contribution Guide

> Complete local environment instructions for developers, maintainers, and project evaluators.

---

## 1. Prerequisites

Ensure your workstation has the following tools installed:

- **Node.js:** v20.x or higher LTS (`node -v`)
- **Package Manager:** `npm` (v10+), `bun`, or `pnpm`
- **Docker & Docker Compose:** Docker Desktop or Docker Engine v24+
- **Git:** v2.38+ with conventional commit conventions
- *(Optional for Phase 5)* **Minikube & kubectl:** for local Kubernetes verification

---

## 2. Quickstart (Frontend Development)

```bash
# 1. Clone repository
git clone https://github.com/<your-username>/Web-PBL.git
cd Web-PBL

# 2. Configure environment
cp .env.example .env.local

# 3. Install frontend dependencies
npm install

# 4. Start local development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 3. Available NPM Scripts

| Command | Action |
|---|---|
| `npm run dev` | Starts Next.js development server with hot module reloading on port 3000 |
| `npm run build` | Compiles production-ready standalone build in `.next/` |
| `npm run start` | Boots production server from compiled build |
| `npm run lint` | Runs ESLint 9 checks across all TypeScript and React files |
| `npm run type-check` | Executes TypeScript type-checker without emitting output |
| `npm run clean` | Cleans Next.js build cache and temporary files |

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

## 5. Coding Standards & Git Workflow

### 5.1 Branching Strategy
- `master` / `main`: Production-ready, validated code.
- `develop`: Ongoing integration branch.
- `feature/<name>`: Individual feature branches.

### 5.2 Conventional Commits
All commits must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
- `feat: <description>` — New user-facing feature.
- `fix: <description>` — Bug fix.
- `docs: <description>` — Documentation changes.
- `chore: <description>` — Tooling, dependency, or configuration updates.
- `refactor: <description>` — Code reorganization without functional changes.
- `test: <description>` — Adding or updating test suites.

### 5.3 Code Style Rules
- Use TypeScript strict mode everywhere (`noImplicitAny: true`).
- Destructure props cleanly with interface typing.
- Always include accessible labels, focus rings, and proper ARIA tags on interactive elements.
- Never hardcode passwords, secret keys, or private URLs in source files.
