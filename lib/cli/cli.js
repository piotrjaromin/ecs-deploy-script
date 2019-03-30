'use strict';

const program = require('commander');

function processCmdAction(logger, cmdActions) {
    let cmd;

    program
        .version('1.0.0')
        .arguments('<cmd>')
        .option('-c, --clusterName [string]', 'ecs cluster name')
        .option('-s, --serviceName [string]', 'ecs service name in cluster')
        .option('-i, --image [string]', 'docker repo with image e.g repo/image:tag')
        .option('-a, --codedeployApp [string]', 'codedeploy application used to release, defaults to serviceName')
        .option('-g, --codedeployGroup [string]', 'codedeploy group inside codedeploy app used to release, defaults to serviceName')
        .action(cmdValue => {
            cmd = cmdValue;
        })
        .parse(process.argv);

    logger.debug(`selected command: ${cmd}`);
    const cmdAction = cmdActions[cmd];
    if (!cmdAction) {
        logger.error('Unsupported command');
        process.exit(1);
    }

    cmdAction.requiredOpts.forEach(arg => {
        if (!program[arg]) {
            logger.error(`--${arg} is required`);
            process.exit(1);
        }
    });

    cmdAction(logger, program);
}

module.exports = {
    processCmdAction,
};
