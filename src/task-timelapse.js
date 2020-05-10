const LOG = require('./log').getLogger('task-timelapse');

const {Worker, workerData} = require('worker_threads');
const path = require('path');
const fs = require('fs');
const dateFormat = require('dateformat');

const raspistill = require('./raspistill');

const {pathTemp, pathTarget, timeS} = workerData;

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

(async () => {
    const config = {
        source: path.resolve(pathTemp),
        dest: path.resolve(pathTarget, 'test_' + dateFormat(new Date(), 'yyyy-mm-dd_h:MM:ss'))
    };
    LOG.debug(config);

    // create target dir
    fs.mkdirSync(config.dest);

    // move task
    const moveTask = startMoveTask(config.source, config.dest);

    // exec raspistill
    await raspistill(config.source, timeS, out => LOG.d(out), err => LOG.w(err));

    // stop movetask
    setTimeout(() => moveTask.terminate(), 5000);
})();


