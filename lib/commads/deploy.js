'use strict';

const {ECS, CodeDeploy} = require('aws-sdk');

const {getTaskDefinition} = require('../aws/ecs/get-task-definitions');
const {updateTaskDefinition} = require('../aws/ecs/update-task-definition');
const {getEcsService} = require('../aws/ecs/get-ecs-service');
const {createDeployment} = require('../aws/codedeploy/create-deployment');

const requiredOpts = ['clusterName', 'serviceName', 'image'];

function deploy(logger, {clusterName, serviceName, image, codedeployApp = serviceName, codedeployGroup = serviceName}) {
    const ecs = new ECS({apiVersion: '2014-11-13'});
    const codedeploy = new CodeDeploy();

    return getEcsService(logger, ecs, clusterName, serviceName)
        .then(service => {
            const taskDefinitionArn = service.taskDefinition;

            delete service.events;
            logger.debug(service);

            if (service.loadBalancers == 0 ) {
                throw new Error('Missing load balancers info in service');
            }

            const {
                containerName,
                containerPort,
            } = service.loadBalancers[0];

            return getTaskDefinition(logger, ecs, getFamilyNameFromArn(taskDefinitionArn))
                .then(({taskDefinition}) => updateTaskDefinition(logger, ecs, taskDefinition, image))
                .then(({taskDefinition}) => {
                    logger.info(`New task Definition arn is ${taskDefinition.taskDefinitionArn}`);
                    const taskDefArn = taskDefinition.taskDefinitionArn;
                    return createDeployment(
                        logger, codedeploy, codedeployApp, codedeployGroup, taskDefArn, containerName, containerPort
                    );
                });
        })
        .then(() => logger.info('Done'))
        .catch(err => logger.error('Update failure', err));
}

function getFamilyNameFromArn(taskDefArn) {
    const familyWithRevision = taskDefArn.split('/', 2)[1];
    const family = familyWithRevision.split(':', 2)[0];
    return family;
}

deploy.requiredOpts = requiredOpts;

module.exports = {
    deploy,
};
