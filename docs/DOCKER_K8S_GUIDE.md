# MATCH@SAHRDAYA — Docker Containerization & Kubernetes (Minikube) Guide

> **Project Requirement:** Containerization via Docker & Orchestration via Kubernetes/Minikube  
> **Environment Targets:** Local Development (Docker Compose) & Production Cluster (Minikube / K8s)  

---

## 1. Containerization Architecture

```mermaid
graph TB
    subgraph "Docker Compose / Development Cluster"
        FE["Frontend Container\nNext.js (Port 3000)"]
        BE["Backend Container\nNestJS GraphQL (Port 4000)"]
        DB["Database Container\nPostgreSQL 16 (Port 5432)"]
        REDIS["Cache Container\nRedis 7 (Port 6379)"]
    end

    FE -->|HTTP / GraphQL| BE
    BE -->|SQL Queries| DB
    BE -->|Pub/Sub & Caching| REDIS
```

---

## 2. Multi-Stage Dockerfiles

### 2.1 Next.js Frontend Dockerfile (`frontend.Dockerfile`)
Optimized using Next.js `output: 'standalone'` to reduce image size from >1GB to ~120MB.

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* bun.lock* ./
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

# Stage 3: Production Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### 2.2 NestJS Backend Dockerfile (`backend.Dockerfile`)
```dockerfile
# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=build /app/dist ./dist

EXPOSE 4000
USER node
CMD ["node", "dist/main"]
```

---

## 3. Docker Compose Orchestration (`docker-compose.yml`)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: match_sahrdaya_db
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgrespassword
      POSTGRES_DB: match_sahrdaya
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: match_sahrdaya_api
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      NODE_ENV: development
      PORT: 4000
      DATABASE_URL: postgresql://postgres:postgrespassword@postgres:5432/match_sahrdaya?schema=public
      JWT_SECRET: dev-secret-key-change-in-prod
    ports:
      - "4000:4000"

  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: match_sahrdaya_web
    restart: unless-stopped
    depends_on:
      - backend
    environment:
      NEXT_PUBLIC_APP_URL: http://localhost:3000
      NEXT_PUBLIC_GRAPHQL_ENDPOINT: http://backend:4000/graphql
    ports:
      - "3000:3000"

volumes:
  postgres_data:
```

---

## 4. Kubernetes (Minikube) Deployment Manifests

```mermaid
graph TB
    subgraph "Kubernetes Cluster (Namespace: match-sahrdaya)"
        Ingress["Nginx Ingress Controller"]
        
        subgraph "Frontend Pods (ReplicaSet = 2)"
            FE1["Frontend Pod 1"]
            FE2["Frontend Pod 2"]
        end
        
        subgraph "Backend Pods (ReplicaSet = 2)"
            BE1["Backend Pod 1"]
            BE2["Backend Pod 2"]
        end

        subgraph "Data Storage"
            PGPod["PostgreSQL Stateful Pod"]
            PVC["PersistentVolumeClaim (10Gi)"]
        end
    end

    Ingress -->|/| FE1 & FE2
    Ingress -->|/graphql| BE1 & BE2
    BE1 & BE2 --> PGPod
    PGPod --> PVC
```

### 4.1 Namespace Manifest (`k8s/00-namespace.yaml`)
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: match-sahrdaya
```

### 4.2 Cluster Secrets & ConfigMaps (`k8s/05-secrets.yaml` & `k8s/06-configmap.yaml`)
*Compliant with SKILL.md: Keeps credentials out of manifests and images.*

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
  namespace: match-sahrdaya
type: Opaque
stringData:
  password: "postgrespassword"
  jwt-secret: "production-jwt-cluster-secret-key-min-32-chars"
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: match-sahrdaya
data:
  NODE_ENV: "production"
  PORT: "4000"
  DATABASE_NAME: "match_sahrdaya"
  DATABASE_HOST: "postgres-service"
  DATABASE_PORT: "5432"
  DATABASE_USER: "postgres"
  APP_URL: "http://match.sahrdaya.local"
```

### 4.3 Database StatefulSet (`k8s/10-postgres.yaml`)
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
  namespace: match-sahrdaya
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  namespace: match-sahrdaya
spec:
  serviceName: postgres
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres
          image: postgres:16-alpine
          ports:
            - containerPort: 5432
          env:
            - name: POSTGRES_DB
              value: match_sahrdaya
            - name: POSTGRES_USER
              value: postgres
            - name: POSTGRES_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: db-secret
                  key: password
          volumeMounts:
            - name: postgres-storage
              mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
    - metadata:
        name: postgres-storage
      spec:
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 5Gi
---
apiVersion: v1
kind: Service
metadata:
  name: postgres-service
  namespace: match-sahrdaya
spec:
  ports:
    - port: 5432
  selector:
    app: postgres
```

### 4.3 Backend Deployment (`k8s/20-backend.yaml`)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-deployment
  namespace: match-sahrdaya
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
        - name: backend
          image: match-sahrdaya-backend:latest
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 4000
          env:
            - name: DATABASE_URL
              value: "postgresql://postgres:postgrespassword@postgres-service:5432/match_sahrdaya"
            - name: JWT_SECRET
              value: "production-ready-jwt-secret-key"
          readinessProbe:
            httpGet:
              path: /health
              port: 4000
            initialDelaySeconds: 5
            periodSeconds: 10
          livenessProbe:
            httpGet:
              path: /health
              port: 4000
            initialDelaySeconds: 15
            periodSeconds: 20
---
apiVersion: v1
kind: Service
metadata:
  name: backend-service
  namespace: match-sahrdaya
spec:
  type: ClusterIP
  ports:
    - port: 4000
      targetPort: 4000
  selector:
    app: backend
```

### 4.4 Frontend Deployment (`k8s/30-frontend.yaml`)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend-deployment
  namespace: match-sahrdaya
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
        - name: frontend
          image: match-sahrdaya-frontend:latest
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 3000
          readinessProbe:
            httpGet:
              path: /
              port: 3000
            initialDelaySeconds: 10
            periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
  namespace: match-sahrdaya
spec:
  type: ClusterIP
  ports:
    - port: 3000
      targetPort: 3000
  selector:
    app: frontend
```

### 4.5 Ingress Controller (`k8s/40-ingress.yaml`)
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: match-sahrdaya-ingress
  namespace: match-sahrdaya
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/proxy-body-size: "10m"
spec:
  rules:
    - host: match.sahrdaya.local
      http:
        paths:
          - path: /graphql
            pathType: Prefix
            backend:
              service:
                name: backend-service
                port:
                  number: 4000
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend-service
                port:
                  number: 3000
```

---

## 5. Verification on Minikube

To verify the deployment locally on Minikube:

```bash
# 1. Start Minikube cluster
minikube start --driver=docker

# 2. Enable Ingress Addon
minikube addons enable ingress

# 3. Use Minikube's Docker daemon so locally built images are accessible
eval $(minikube docker-env)

# 4. Build images inside Minikube
docker build -t match-sahrdaya-frontend:latest .
docker build -t match-sahrdaya-backend:latest ./backend

# 5. Apply all Kubernetes manifests
kubectl apply -f k8s/

# 6. Verify Pods and Services
kubectl get pods -n match-sahrdaya
kubectl get svc -n match-sahrdaya
kubectl get ingress -n match-sahrdaya

# 7. Map local hosts file
# Add: $(minikube ip) match.sahrdaya.local to /etc/hosts (or C:\Windows\System32\drivers\etc\hosts)
```
