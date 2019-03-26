# ECS Deploy script

Script updates docker image in task definition, it searches given cluster for service, and then updates task definition associated with it.

## Sample

Before calling this script you need to have access to given cluster and service.

```bash
node deploy.js -c cluster_name \
    -s service_name \
    -i repo/image:tag
```