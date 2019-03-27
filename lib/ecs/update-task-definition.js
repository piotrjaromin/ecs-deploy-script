'use strict';


function updateTaskDefinition(logger, ecs, taskDefinition, newImage) {
    logger.info(`Setting task definition image to ${newImage}`);
    taskDefinition.containerDefinitions[0].image = newImage;

    delete taskDefinition.taskDefinitionArn;
    delete taskDefinition.revision;
    delete taskDefinition.status;
    delete taskDefinition.requiresAttributes;
    delete taskDefinition.compatibilities;

    return ecs.registerTaskDefinition(taskDefinition).promise();
};

module.exports = {
    updateTaskDefinition,
};
