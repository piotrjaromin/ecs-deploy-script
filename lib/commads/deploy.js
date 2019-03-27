'use strict';

const {ECS} = require('aws-sdk');

const {getTaskDefinition} = require('../ecs/get-task-definitions');
const {updateTaskDefinition} = require('../ecs/update-task-definition');
const {getEcsService} = require('../ecs/get-ecs-service');

const ecs = new ECS({apiVersion: '2014-11-13'});

function deploy(logger, clusterName, serviceName, image) {
    return getEcsService(logger, ecs, clusterName, serviceName)
        .then(service => {
            const taskDefinitionArn = service.taskDefinition;

            return getTaskDefinition(logger, ecs, getFamilyNameFromArn(taskDefinitionArn))
                .then(({taskDefinition}) => updateTaskDefinition(logger, ecs, taskDefinition, image));
        })
        .then(({taskDefinition}) => {
            logger.info(`New task Definition arn is ${taskDefinition.taskDefinitionArn}`);
            logger.info('Done.');
        })
        .catch(err => logger.error('Update failure', err));
}

function getFamilyNameFromArn(taskDefArn) {
    const familyWithRevision = taskDefArn.split('/', 2)[1];
    const family = familyWithRevision.split(':', 2)[0];
    return family;
}

module.exports = {
    deploy,
};
