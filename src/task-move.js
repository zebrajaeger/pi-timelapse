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

let canRun = true;
let intervalCounter = 0;

parentPort.on('message', msg => {
    if(msg==='stop'){
        canRun = false;
    }
});

function moveFiles() {
    fs.readdirSync(pathFrom).forEach(f => {
        if (f.toLowerCase().endsWith('.jpg')) {
            let fullPath = path.resolve(pathFrom, f);
            LOG.info(`Process file '${fullPath}'`);
            (async () => {
                await fsUtils.sudoChownFiles(fullPath, 'pi', 'pi');
                await fsUtils.mv(fullPath, dest);
            })();
        }
    });
}

let handle = setInterval(() => {
    if(!canRun){
        clearInterval(handle);
    }
    if(intervalCounter++ >=10 ){
        intervalCounter = 0;
        moveFiles()
    }
}, 100);
