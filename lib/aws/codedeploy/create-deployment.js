'use strict';

const crypto = require('crypto');

function createDeployment(logger, codedeploy, codedeployApp, codedeployGroup, taskDef, contName, contPort) {
    const appSpecContent = appSpecContentTemplate(taskDef, contName, contPort);
    const sha256 = crypto.createHash('sha256').update(appSpecContent).digest('hex');

    logger.debug(JSON.stringify(appSpecContent, null, 2));
    logger.debug(`sha256 for appSpec is ${sha256}`);

    return codedeploy.createDeployment({
        applicationName: codedeployApp,
        deploymentGroupName: codedeployGroup,
        description: `Handled by ecs-deploy-script at ${new Date()}`,
        autoRollbackConfiguration: {
            enabled: true,
            events: [
                'DEPLOYMENT_FAILURE', 'DEPLOYMENT_STOP_ON_ALARM', 'DEPLOYMENT_STOP_ON_REQUEST',
            ],
        },
        revision: {
            appSpecContent: {
                content: appSpecContent,
                sha256,
            },
            revisionType: 'AppSpecContent',
        },
    })
        .promise()
        .then(({deploymentId}) => {
            logger.info(`deployment id is ${deploymentId}`);
            return deploymentId;
        });
}

const appSpecContentTemplate = (taskDefinitionWithRevisionArn, containerName, containerPort) => JSON.stringify({
    version: 1,
    Resources: [
        {
            TargetService: {
                Type: 'AWS::ECS::Service',
                Properties: {
                    TaskDefinition: taskDefinitionWithRevisionArn,
                    LoadBalancerInfo: {
                        ContainerName: containerName,
                        ContainerPort: containerPort,
                    },
                },
            },
        },
    ],
});

module.exports = {
    createDeployment,
};
