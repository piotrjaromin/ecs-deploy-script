'use strict';

const {CodeDeploy} = require('aws-sdk');

const {rollbackDeployment} = require('../aws/codedeploy/rollback-deployment');

const requiredOpts = ['deploymentId'];

function rollbackDeploy(logger, {deploymentId}) {
    const codedeploy = new CodeDeploy();
    return rollbackDeployment(logger, codedeploy, deploymentId);
}

rollbackDeploy.requiredOpts = requiredOpts;

module.exports = {
    rollbackDeploy,
};
