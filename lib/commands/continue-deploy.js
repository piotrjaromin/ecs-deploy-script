'use strict';

const {CodeDeploy} = require('aws-sdk');

const {continueDeployment} = require('../aws/codedeploy/continue-deployment');

const requiredOpts = ['deploymentId'];

function continueDeploy(logger, {deploymentId}) {
    const codedeploy = new CodeDeploy();

    return continueDeployment(logger, codedeploy, deploymentId);
}

continueDeploy.requiredOpts = requiredOpts;

module.exports = {
    continueDeploy,
};
