#!/usr/bin/env bash
set -e

echo "Applying Kubernetes manifests in namespace: match-sahrdaya..."

kubectl apply -f k8s/00-namespace.yaml
kubectl apply -f k8s/05-secrets.yaml
kubectl apply -f k8s/06-configmap.yaml
kubectl apply -f k8s/10-postgres.yaml
kubectl apply -f k8s/15-redis.yaml
kubectl apply -f k8s/20-backend.yaml
kubectl apply -f k8s/25-frontend.yaml
kubectl apply -f k8s/30-ingress.yaml

echo "All Kubernetes resources applied successfully."
echo "Check pod status: kubectl get pods -n match-sahrdaya -w"
