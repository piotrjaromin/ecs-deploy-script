'use strict';


function listDeployments(logger, codedeploy, codedeployApp, codedeployGroup,) {
    logger.info('calling list deployments');
    return codedeploy.listDeployments({
        applicationName: codedeployApp,
        deploymentGroupName: codedeployGroup,
        includeOnlyStatuses: ['InProgress'],
    })
        .promise();
}


module.exports = {
    listDeployments,
};
