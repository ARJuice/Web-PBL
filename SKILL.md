---
name: web-technologies-project
description: Build, extend, debug, test, and deploy the user's Web Technologies project. Use whenever working on its requirements, UI, API, database, architecture, documentation, containers, CI/CD, Kubernetes/Minikube, or monitoring. Follow the required Next.js + NestJS + GraphQL stack and the repository's existing conventions.
---

# Web Technologies Project

Build a **working, integrated, secure, maintainable, demonstrable application**—not just UI mockups or disconnected code. Treat the user's project brief and repository as the source of truth. Keep implementations simple enough for the team to understand and explain.

## Required stack

- **Frontend:** Next.js; Tailwind CSS or a consistent suitable CSS approach.
- **Backend/API:** NestJS with GraphQL queries and mutations.
- **Data:** a suitable relational, NoSQL, or cloud database.
- **Project workflow:** Git/GitHub.
- **Delivery:** Docker, a basic CI/CD workflow (e.g. GitHub Actions), Kubernetes/Minikube deployment, and basic logging, monitoring, or error tracking (e.g. Sentry, Prometheus, or Grafana).

Keep these core technologies unless the user explicitly requests a deviation. Choose supporting libraries based on need; avoid unnecessary dependencies and infrastructure.

## Workflow

For each task, skip only steps that do not apply:

1. **Understand:** identify the user outcome and relevant functional requirements. Record material assumptions; do not invent requirements.
2. **Inspect:** examine affected files, project structure, manifests, configuration, tests, and existing scripts before editing. Preserve working behavior and local conventions.
3. **Plan:** choose the smallest complete change and identify affected layers, risks, and checks.
4. **Implement end to end:** connect the UI, GraphQL API, NestJS services, and database wherever the workflow requires them. Do not stop at a stub when real integration is expected.
5. **Verify:** run relevant existing lint, type-check, test, build, and/or runtime checks. Investigate failures rather than hiding them.
6. **Document and report:** update affected setup/API/deployment documentation. State what changed, checks actually run and their results, and any remaining gaps.

Use the repository's package manager and lockfile. Avoid unrelated rewrites, destructive commands, and overwriting user work.

## Engineering rules

### Architecture and frontend

- Keep clear boundaries: Next.js handles presentation and user interaction; NestJS owns business rules, validation, authorization, and persistence orchestration; GraphQL exposes typed operations; database access stays behind backend services/data-access code.
- Build reusable, focused components and modules. Follow the router and architecture already in use unless there is a good reason to change them.
- Every visible control must perform its intended action. Implement responsive layouts, accessible labels/semantics, and useful loading, empty, success, validation, and error states where relevant.
- Use real API-backed data for implemented workflows. Clearly label intentional demo/seed data; do not present mock results as completed backend functionality.

### GraphQL, backend, and database

- Define the GraphQL schema, inputs, queries, and mutations around actual user workflows. Keep resolvers thin and business logic in services.
- Validate all untrusted input on the server. Handle missing records, duplicates, invalid input, permission failures, and dependency errors appropriately without exposing secrets or internal stack traces.
- Model entities/collections, relationships, constraints, and indexes as needed. Implement real persistence for required operations and use migrations or repeatable schema setup where supported.
- Keep frontend expectations, schema, implementation, and API documentation consistent.

### Security and configuration

- Assess whether authentication and authorization are needed for the use case. When required, enforce permissions on the server; hiding UI controls is not authorization.
- Keep credentials and private data out of source control, client bundles, logs, and container images. Use environment configuration or a secret store and provide safe placeholders in `.env.example`.
- Validate configuration, apply least privilege, and use suitable CORS, session/token, cookie, and transport-security settings for the design. Add appropriate ignore rules for secrets, dependencies, and generated files.

### Quality and delivery

- Test critical user workflows across the UI → GraphQL → backend → database path, plus relevant validation and failure cases. Add focused unit, integration, or end-to-end tests appropriate to the change.
- Make local setup reproducible from a fresh clone. Document prerequisites, environment variables, database initialization, commands, service URLs, tests, and troubleshooting.
- Provide Docker configuration for relevant services and Compose for local multi-service development when useful. Provide Kubernetes manifests for the actual architecture; use Minikube when suitable for local demonstration. Include sensible configuration, service connectivity, and health probes where appropriate.
- CI/CD must run real checks supported by the repo. Describe the pipeline accurately: a build/test workflow is not deployment unless it deploys.
- Configure at least one useful, demonstrable form of logging, monitoring, or error tracking. Never log secrets. Do not claim infrastructure works without testing it.
- Use Git/GitHub for collaboration and reviewable changes. Do not claim a commit, push, CI run, or deployment succeeded unless there is evidence it did.

## Definition of done

A change is done when its relevant requirements work in context, the affected checks have been run where possible, and gaps are explicit. At project level, verify that:

- [ ] Next.js, NestJS, GraphQL, and the chosen database are integrated for the core workflows.
- [ ] Core features, validation, error states, and applicable access controls work.
- [ ] Tests and build checks pass, or failures and untested areas are documented.
- [ ] Git/GitHub, Docker, CI/CD, Kubernetes/Minikube, and basic logging/monitoring are configured as required and their actual verification status is clear.
- [ ] Setup, API, and deployment instructions match the implementation.

Never fabricate features, test results, coverage, security claims, screenshots, integrations, or deployment status. If blocked by missing credentials, tools, or environment access, state the blocker and give the most useful next step.
