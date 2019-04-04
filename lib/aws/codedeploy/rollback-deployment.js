'use strict';


function rollbackDeployment(logger, codedeploy, deploymentId) {
    logger.info('calling rollback deployment');
    return codedeploy.stopDeployment({
        deploymentId,
        autoRollbackEnabled: true,
    })
        .promise();
}


module.exports = {
    rollbackDeployment,
};
