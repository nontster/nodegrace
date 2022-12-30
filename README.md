# nodegrace

## Using Node.js and Express.js to demonstrate zero downtime deployments in Kubernetes

### Create kind cluster with ingress controller support
```
kind create cluster --config=kind-config.yaml
```

### Deploy application
```
kubectl apply -f .\deploy
```

### Run load test using k6
```
k6 run .\k6\script.js
```

### Simulate Pod restart
```
kubectl rollout restart deployment/nodegrace
```

### Investigate deployment rollout status
```
kubectl rollout status deployment/nodegrace
```
### k6 load test result has no error
![k6 load test result has no error](https://github.com/nontster/nodegrace/blob/main/assets/images/screenshot-k6-2022-12-30%20203326.png?raw=true)

---
## Building Multi-Architecture Docker Images With Buildx

## Create builder instance
```
docker buildx create --name mybuilder --use --bootstrap --platform linux/amd64,linux/arm/v8
```

## Build docker image for linux/amd64 and linux/arm64
```
docker buildx build --push --platform linux/amd64,linux/arm/v8 --tag nontster/nodegrace:1.4 .
```
