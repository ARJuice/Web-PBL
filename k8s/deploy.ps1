# Apply all manifests in dependency order
kubectl apply -f k8s/00-namespace.yaml
kubectl apply -f k8s/05-secrets.yaml
kubectl apply -f k8s/06-configmap.yaml
kubectl apply -f k8s/10-postgres.yaml
kubectl apply -f k8s/15-redis.yaml
kubectl apply -f k8s/20-backend.yaml
kubectl apply -f k8s/25-frontend.yaml
kubectl apply -f k8s/30-ingress.yaml

Write-Host "All Kubernetes resources applied in namespace: match-sahrdaya"
Write-Host "To monitor deployment:"
Write-Host "kubectl get pods -n match-sahrdaya -w"
