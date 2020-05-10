/*
This file is part of pi-timelapse / picam (https://github.com/zebrajaeger/pi-timelapse).

pi-timelapse is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

pi-timelapse is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See theGNU General Public License for more details.

You should have received a copy of the GNU General Public License along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

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
