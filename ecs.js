#!/usr/bin/env node

'use strict';

const {ECS} = require('aws-sdk');

const logger = require('simple-node-logger').createSimpleLogger();
logger.setLevel(process.env.LOG_LEVEL || 'debug');

const {parseCmdArgs} = require('./lib/cli/cli');
const {deploy} = require('./lib/commads/deploy');

const cmdActions = {
    'deploy': deploy,
};

const {
    cmd,
    image,
    clusterName,
    serviceName,
} = parseCmdArgs();

logger.debug(`selected command: ${cmd}`);
const cmdAction = cmdActions[cmd];
if (!cmdAction) {
    logger.error('Unsupported command');
    process.exit(1);
}

cmdAction(logger, clusterName, serviceName, image);

