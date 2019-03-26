'use strict';

const {ECS} = require('aws-sdk');
const program = require('commander');

const logger = require('simple-node-logger').createSimpleLogger();
logger.setLevel(process.env.LOG_LEVEL || 'debug');

const {getTaskDefinition} = require('./lib/get-task-definitions');
const {updateTaskDefinition} = require('./lib/update-task-definition');
const {getEcsService} = require('./lib/get-ecs-service');

let cmd;

program
    .version('1.0.0')
    .arguments('<cmd>')
    .option('-c, --clusterName [string]', 'ecs cluster name')
    .option('-s, --serviceName [string]', 'ecs service name in cluster')
    .option('-i, --image [string]', 'docker repo with image e.g repo/image:tag')
    .action(function (cmdValue) {
        cmd = cmdValue;
    })
    .parse(process.argv);

const requiredArgs = ['clusterName', 'serviceName', 'image'];
requiredArgs.forEach(arg => {
    if (!program[arg]) {
        logger.error(`--${arg} is required`);
        process.exit(1);
    }
});

const {
    clusterName,
    serviceName,
    image,
} = program;

const ecs = new ECS({apiVersion: '2014-11-13'});

const actions = {
    'deploy': deploy
}

logger.debug(`selected command: ${cmd}`);

const action = actions[cmd];
if (!action) {
    logger.error('Unsupported command');
    process.exit(1);
}

action();

function deploy() {
    return getEcsService(logger, ecs, clusterName, serviceName)
        .then(({taskDefinition}) => getTaskDefinition(logger, ecs, getFamilyNameFromArn(taskDefinition)))
        .then(({taskDefinition}) => updateTaskDefinition(logger, ecs, taskDefinition, image))
        .then(({taskDefinition}) => {
            logger.info(`New task Definition arn is ${taskDefinition.taskDefinitionArn}`);
            logger.info('Done.')
        })
        .catch(err => logger.error('Update failure', err));
}


function getFamilyNameFromArn(taskDefArn) {
    const familyWithRevision = taskDefArn.split('/', 2)[1];
    const family = familyWithRevision.split(':', 2)[0];
    return family;
}