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
