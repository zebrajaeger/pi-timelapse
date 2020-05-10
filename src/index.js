/*
This file is part of pi-timelapse / picam (https://github.com/zebrajaeger/pi-timelapse).

pi-timelapse is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

pi-timelapse is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See theGNU General Public License for more details.

You should have received a copy of the GNU General Public License along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

const LOG = require('./log').getLogger('Main');

const {Worker} = require('worker_threads');

const fsUtils = require('./fsutils');
const system = require('./system');
const mount = require('./mount');
const Led = require('./io/led');
const ToggleButton = require('./io/togglebutton');
const ResetButton = require('./io/resetbutton');
const Power = require('./io/power');

const params = {
    tempPath: '/var/cam',
    hddPath: '/mnt/hdd',
    runtimeS: 3600 * 24
};

let worker = null;
let led = new Led(21);
let power = new Power(26, 1);
let captureButton = new ToggleButton(20, 0);
let resetButton = new ResetButton(16, 5000);

let isHddMounted = mount.isMounted(params.hddPath);
let isCapturing = false;

async function startRaspistillTask() {
    LOG.info(`Start capture task`);
    // check that HDD is mounted
    let isMounted = await mount.isMounted(params.hddPath);
    if (!isMounted) {
        LOG.fatal('HDD not mounted, exiting', params.hddPath);
        return -1;
    } else {
        LOG.info(`HDD mounted, continue`);
    }

    // check already capturing
    if (isCapturing) {
        LOG.error(`Already capturing`);
        return;
    } else {
        LOG.info(`Not capturing, continue`);
    }
    isCapturing = true;
    await led.setTime(50, 100);

    // clean temp dir from old data
    LOG.info(`Clean temp dir`);
    await fsUtils.sudoClearTempFromJpg(params.tempPath);
    LOG.info(`Clean temp dir done`);

    let workerData = {pathTemp: params.tempPath, pathTarget: params.hddPath, timeS: params.runtimeS};
    const worker = new Worker('./task-timelapse.js', {workerData});
    worker.on('exit', (code) => {
        isCapturing = false;
        button.setState(0);
        led.setTime(1500, 100);
        const msg = `Move Task stopped with exit code ${code}`;
        if (code !== 0) {
            LOG.error(msg);
        } else {
            LOG.info(msg);
        }
    });
    return worker;
}

async function stopRaspistillTask() {
    LOG.info(`Terminate capture task`);
    if (worker) {
        LOG.info(`Worker found, terminate it`);
        await worker.terminate();
        LOG.info(`Worker terminated`);
        worker = null;
    } else {
        LOG.info(`No worker found.`);
    }
}

async function checkMount() {
    let oldState = isHddMounted;
    isHddMounted = await mount.isMounted(params.hddPath);
    LOG.debug(`HDD mounted: ${isHddMounted}`);
    if (isHddMounted !== oldState) {
        if (isHddMounted) {
            LOG.info(`HDD plugged in @${params.hddPath}`);
            led.setTime(2000, 50);
        } else {
            // plugged off
            LOG.info(`HDD plugged out @${params.hddPath}`);
            led.setTime(100, 1500);
            button.setState(0);
            await stopRaspistillTask();
        }
    }
}


(async () => await checkMount())();
setInterval(() => checkMount(), 10000);

led.setTime(50, 2000);
captureButton.onOn(() => {
    // no mount no fun
    if (!isHddMounted) {
        LOG.info(`ToggleButton: HDD not plugged in @${params.hddPath}, so no action will occur`);
        return;
    }
    // start
    (async () => {
        LOG.info(`Start capturing`);
        worker = await startRaspistillTask();
    })();
});

captureButton.onOff(() => {
    // stop
    LOG.info(`Stop capturing`);
    (async () => await stopRaspistillTask())();
});

resetButton.onReset(() => {
    system.shutdown();
})
