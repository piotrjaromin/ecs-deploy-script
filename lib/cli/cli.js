'use strict';

const program = require('commander');

function processCmdAction(logger, cmdActions) {
    program
        .option('-c, --clusterName [string]', 'ecs cluster name')
        .option('-s, --serviceName [string]', 'ecs service name in cluster')
        .option('-i, --image [string]', 'docker repo with image e.g repo/image:tag')
        .option('-a, --codedeployApp [string]', 'codedeploy application used to release, defaults to serviceName')
        .option('-g, --codedeployGroup [string]', 'codedeploy group inside codedeploy app used to release, defaults to serviceName')
        .command('deploy')
        .action(async () => {
            validateProgram(cmdActions.deploy);
            await cmdActions.deploy(logger, program);
        });

    program
        .option('-d, --deploymentId [string]', 'deploymentId to continue')
        .command('continue-deploy')
        .action(async () => {
            validateProgram(cmdActions.continueDeploy);
            await cmdActions.continueDeploy(logger, program);
        });

    program
        .option('-d, --deploymentId [string]', 'deploymentId to continue')
        .command('rollback-deploy')
        .action(async () => {
            validateProgram(cmdActions.rollbackDeploy);
            await cmdActions.rollbackDeploy(logger, program);
        });

    program
        .command('*')
        .action(() =>{
            logger.error('Invalid command');
        });

    program.version('1.0.0').parse(process.argv);
}

function validateProgram(cmdAction) {
    cmdAction.requiredOpts.forEach(arg => {
        if (!program[arg]) {
            console.log(`--${arg} is required`);
            process.exit(1);
        }
    });
};

module.exports = {
    processCmdAction,
};
