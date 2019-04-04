'use strict';

const {CodeDeploy} = require('aws-sdk');

const {listDeployments} = require('../aws/codedeploy/list-deployments');

const requiredOpts = ['codedeployApp', 'codedeployGroup'];

function listDeploys(logger, {codedeployApp, codedeployGroup}) {
    const codedeploy = new CodeDeploy();
    return listDeployments(logger, codedeploy, codedeployApp, codedeployGroup)
        .then(({deployments}) => console.log(JSON.stringify(deployments, null, 2)));
}

listDeploys.requiredOpts = requiredOpts;

module.exports = {
    listDeploys,
};
