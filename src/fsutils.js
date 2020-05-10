const LOG = require('./log').getLogger('fsutils');

const path = require('path');
const {exec} = require('child_process');

// generic
function execCmd(cmd) {
    return new Promise((resolve, reject) => {
        LOG.info(cmd);
        exec(cmd, (err, stdout, stderr) => {
            if (err) {
                LOG.error(`cmd error: '${stderr}'`);
                reject(stderr);
            } else {
                if(stdout){
                    // output only if output available
                    LOG.info(`cmd ok: '${stdout}'`);
                }
                resolve(stdout);
            }
        });
    });
}

// sudo stuff
function sudoChownFiles(p, user, group) {
    return execCmd(`sudo chown -f ${user}.${group} ${p}`);
}

function sudoRmFiles(p) {
    return execCmd(`sudo rm -f ${p}`);
}

// non sudo stuff
function mv(from, to) {
    return execCmd(`mv ${from} ${to}`);
}

function sudoClearTempFromJpg(baseDir) {
    return sudoRmFiles(path.resolve(baseDir, '*.jpg')).then(() => sudoRmFiles(path.resolve(baseDir, '*.jpg~')));
}

module.exports = {
    execCmd: execCmd,
    sudoChownFiles: sudoChownFiles,
    sudoRmFiles: sudoRmFiles,
    mv: mv,
    sudoClearTempFromJpg: sudoClearTempFromJpg
};
