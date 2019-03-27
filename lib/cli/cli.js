'use strict';

const program = require('commander');

const requiredArgs = ['clusterName', 'serviceName', 'image'];

function parseCmdArgs() {
    let cmd;

    program
        .version('1.0.0')
        .arguments('<cmd>')
        .option('-c, --clusterName [string]', 'ecs cluster name')
        .option('-s, --serviceName [string]', 'ecs service name in cluster')
        .option('-i, --image [string]', 'docker repo with image e.g repo/image:tag')
        .action(cmdValue => {
            cmd = cmdValue;
        })
        .parse(process.argv);

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

    return {
        clusterName,
        serviceName,
        image,
        cmd,
    };
}

module.exports = {
    parseCmdArgs,
};
