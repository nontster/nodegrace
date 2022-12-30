# nodegrace
Using Node.js and Express.js to demonstrate zero downtime deployments in Kubernetes

## Create kind cluster with ingress controller support
```
kind create cluster --config=kind-config.yaml
```

## Deploy application
```
kubectl apply -f .\deploy
```

## Run load test using k6
```
k6 run .\k6\script.js
```

## Simulate Pod restart
```
kubectl rollout restart deployment/nodegrace
```

## Investigate deployment rollout status
```
kubectl rollout status deployment/nodegrace
```
### k6 load test result has no error
![k6 load test result has no error](https://github.com/nontster/nodegrace/blob/main/assets/images/screenshot-k6-2022-12-30%20203326.png?raw=true)
