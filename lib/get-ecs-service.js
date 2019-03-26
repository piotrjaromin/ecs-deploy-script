'use strict';

function getEcsService(logger, ecs, clusterName, serviceName) {
    return ecs.describeServices({
        cluster: clusterName,
        services: [serviceName],
    })
        .promise()
        .then(({services}) => {
            const service = services[0];
            if (!service) {
                throw new Error(`Cannot find service ${serviceName} on cluster ${clusterName}`);
            }

            logger.debug(`Got ecs service ${serviceName}, task definition is ${service.taskDefinition}`);
            return service;
        });
}

module.exports = {
    getEcsService,
};
