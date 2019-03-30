#!/usr/bin/env node

'use strict';

const logger = require('simple-node-logger').createSimpleLogger();
logger.setLevel(process.env.LOG_LEVEL || 'debug');

const {processCmdAction} = require('./lib/cli/cli');
const {deploy} = require('./lib/commads/deploy');

const cmdActions = {
    'deploy': deploy,
};

processCmdAction(logger, cmdActions);

