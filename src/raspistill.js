const LOG = require('./log').getLogger('raspistill');

const path = require('path');
const {spawn} = require('child_process');

module.exports = (pathTo, timeS, msgCallbackOut, msgCallbackErr) => {

    return new Promise((resolve, reject) => {

        const targetPath = path.resolve(pathTo, 'img-%08d.jpg');

        const cmd = 'sudo';
        const params = [
            'raspistill',
            '--timestamp',
            '-o', targetPath,
            '--stats', '--verbose',
            '--mode', '2', '--encoding', 'jpg', '--quality', '100',
            '--thumb', 'none', '--nopreview', '--burst',
            '--timeout', timeS * 1000, '--timelapse', '1000'
        ];
        LOG.debug('exec', cmd, params.join(' '));
        const child = spawn(cmd, params);

        if (msgCallbackOut) {
            child.stdout.setEncoding('utf8');
            child.stdout.on('data', (chunk) => msgCallbackOut(chunmk));
        }

        if (msgCallbackErr) {
            child.stderr.setEncoding('utf8');
            child.stderr.on('data', (chunk) => msgCallbackErr * (chunk));
        }

        child.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(code);
            }
        });
    })
};
