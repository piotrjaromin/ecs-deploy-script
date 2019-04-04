'use strict';


function continueDeployment(logger, codedeploy, deploymentId) {
    logger.info('calling continue deployment');
    return codedeploy.continueDeployment({
        deploymentId,
        deploymentWaitType: 'READY_WAIT',
    })
        .promise();
}


module.exports = {
    continueDeployment,
};
