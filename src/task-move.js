/*
This file is part of pi-timelapse / picam (https://github.com/zebrajaeger/pi-timelapse).

pi-timelapse is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

pi-timelapse is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See theGNU General Public License for more details.

You should have received a copy of the GNU General Public License along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

const LOG = require('./log').getLogger('moveTask');

const {workerData, parentPort} = require('worker_threads');
const path = require('path');
const fs = require('fs');
const fsUtils = require('./fsutils');

const {pathFrom, pathTo} = workerData;

LOG.info(workerData);

const dest = pathTo;

// async function moveFile(filePath) {
//     LOG.info(`Move file '${filePath}'`);
//     await fsUtils.sudoChownFile(filePath, 'pi', 'pi');
//     await fsUtils.mv(filePath, dest);
// }

async function processFiles(filePathArray) {
    LOG.info(`Move files '${filePathArray}'`);
    await fsUtils.sudoChownFiles(filePathArray, 'pi', 'pi');
    await fsUtils.mvs(filePathArray, dest);
}

async function moveFiles() {
    LOG.debug('moveFiles()')
    const allFiles = fs.readdirSync(pathFrom);

    const toProcess = [];
    for (let f of allFiles) {
        if (f.toLowerCase().endsWith('.jpg')) {
            toProcess.push(path.resolve(pathFrom, f));
        }
    }
    if (toProcess.length > 0) {
        await processFiles(toProcess);
    }
}

async function startInterval() {
    try {
        await moveFiles();
    } catch (e) {
        LOG.error('Failed to move Files', e);
    }

    setTimeout(startInterval, 1000);
}

LOG.debug('START MoveTask')
startInterval().then();
