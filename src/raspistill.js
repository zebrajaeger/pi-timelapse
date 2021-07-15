/*
This file is part of pi-timelapse / picam (https://github.com/zebrajaeger/pi-timelapse).

pi-timelapse is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

pi-timelapse is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See theGNU General Public License for more details.

You should have received a copy of the GNU General Public License along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

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
                reject('start raspistill failed with code ' + code);
            }
        });
    })
};
