#!/usr/bin/env node

'use strict';

const logger = require('simple-node-logger').createSimpleLogger();
logger.setLevel(process.env.LOG_LEVEL || 'error');

const {processCmdAction} = require('./lib/cli/cli');
const {deploy} = require('./lib/commands/deploy');
const {continueDeploy} = require('./lib/commands/continue-deploy');
const {rollbackDeploy} = require('./lib/commands/rollback-deploy');

const cmdActions = {
    'deploy': deploy,
    'continueDeploy': continueDeploy,
    'rollbackDeploy': rollbackDeploy,
};

processCmdAction(logger, cmdActions);

