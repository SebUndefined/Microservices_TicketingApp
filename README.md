# Microservices_TicketingApp

kubectl create secret generic jwt-secret --from-literal=JWT_KEY=[yourSecret]

Port forwarding with kubernetees

1. Get pods

```bash
kubectl get pods
NAME                                  READY   STATUS    RESTARTS   AGE
auth-depl-699c8474ff-kdsm7            1/1     Running   0          17m
auth-mongo-depl-8466d8bd7-mv59l       1/1     Running   0          17m
client-depl-7bb6788cf5-jp8gb          1/1     Running   0          17m
nats-depl-6fcc4b596b-2rwbd            1/1     Running   0          17m
tickets-depl-79bd4dc7f9-fzvzf         1/1     Running   0          17m
tickets-mongo-depl-768dc7fc79-5kx69   1/1     Running   0          17m
```

Copy the name (here nats-depl-6fcc4b596b-2rwbd)

Then run :

```bash
kubectl port-forward nats-depl-6fcc4b596b-2rwbd 4222:4222
```

Result

```bash
$ kubectl port-forward nats-depl-6fcc4b596b-2rwbd 4222:4222
Forwarding from 127.0.0.1:4222 -> 4222
Forwarding from [::1]:4222 -> 4222
Handling connection for 4222
```

Monitoring NATS
localhost:8222/streaming
