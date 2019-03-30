# ECS Deploy script

Script updates docker image in task definition, it searches given cluster for service, and then updates task definition associated with it, at the end it triggers deployment through code deploy.

Prerequesities:

- installed nodejs
- installed npm
- called `npm install`
- AWS credentials set up correctly (you need to be able to call ECS and CodeDeploy)

## Sample

Before calling this script you need to have access to given cluster and service.

```bash
ecs.js deploy --clusterName cluster_name \
    -serviceName service_name \
    --image repo/image:tag \
    --codedeployGroup code_deploy_group \
    --codedeployApp code_deploy_app
```

shorthand version:

```bash
ecs.js deploy -c cluster_name \
    -s service_name \
    -i repo/image:tag \
    -g code_deploy_group \
    -a code_deploy_app
```

`--codedeployGroup` and `--codedeployApp` are codedeploy application and deployment group belonging to this application, they are called to trigger deployment. If those values are not provided they default to service name

### Assume role

If your AWS configuration (`~/.aws`) requires to assume role then you can try calling this script like below:

```bash
export AWS_SDK_LOAD_CONFIG=true
export AWS_PROFILE=aws_profile_with_role_to_assume
ecs.js deploy .....
```

or

```bash
export AWS_SESSION_TOKEN=token
export AWS_SECRET_ACCESS_KEY=access_secret_key
export AWS_ACCESS_KEY_ID=aws_key
ecs.js deploy .....
```