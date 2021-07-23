/*
This file is part of pi-timelapse / picam (https://github.com/zebrajaeger/pi-timelapse).

pi-timelapse is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

pi-timelapse is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See theGNU General Public License for more details.

You should have received a copy of the GNU General Public License along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

const LOG = require('./log').getLogger('task-timelapse');

const {Worker, workerData} = require('worker_threads');
const path = require('path');
const fs = require('fs');
const dateFormat = require('dateformat');

const raspistill = require('./raspistill');

const {pathTemp, pathTarget, targetPrefix, timeS} = workerData;

function startMoveTask(from, to) {
    let workerData = {pathFrom: from, pathTo: to};
    const worker = new Worker('./task-move.js', {workerData});
    worker.on('exit', (code) => {
        const msg = `Move Task stopped with exit code ${code}`;
        if (code !== 0) {
            LOG.error(msg);
        } else {
            LOG.info(msg);
        }
    });
    return worker;
}

async function main() {
    const config = {
        source: path.resolve(pathTemp),
        dest: path.resolve(pathTarget, targetPrefix + dateFormat(new Date(), 'yyyy-mm-dd_hMMss'))
    };
    LOG.debug(config);

    // create target dir
    fs.mkdirSync(config.dest);

    // move task
    const moveTask = startMoveTask(config.source, config.dest);

    // exec raspistill
    try {
        await raspistill(config.source, timeS, out => LOG.debug(out), err => LOG.warn(err));
    } catch (e) {
        process.exit(-666);
    }

    // stop movetask after 1,5 seconds
    await new Promise(resolve => setTimeout(resolve, 1500));
    await moveTask.terminate();
}

main().then();

