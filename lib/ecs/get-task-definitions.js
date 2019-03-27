'use strict';


function getTaskDefinition(logger, ecs, taskDefinitionFamily) {
    return ecs.listTaskDefinitions({
        sort: 'DESC',
        familyPrefix: taskDefinitionFamily,
    }).promise()
        .then(({taskDefinitionArns}) => {
            if (!taskDefinitionArns) {
                throw new Error(`Missing taskDefinitionArns for ${taskDefinitionFamily} family`);
            }

            const mostRecentDef = taskDefinitionArns[0];
            if (!mostRecentDef) {
                // TODO add options to provide definition from file
                throw new Error(`${taskDefinitionFamily} family does not have any task definitions`);
            }

            logger.debug(`Found task definition for family ${taskDefinitionFamily}, most recent task definition arn is ${mostRecentDef}`);
            return ecs.describeTaskDefinition({
                taskDefinition: mostRecentDef,
            }).promise();
        });
}

module.exports = {
    getTaskDefinition,
};
