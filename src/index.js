const LOG = require('./log').getLogger('Main');

const {Worker} = require('worker_threads');

const fsUtils = require('./fsutils');
const mount = require('./mount');
const Led = require('./io/led');
const ToggleButton = require('./io/togglebutton');
const Power = require('./io/power');

const params = {
    tempPath: '/var/cam',
    hddPath: '/mnt/hdd',
    runtimeS: 3600 * 24
};

let worker = null;
let led = new Led(21);
let power = new Power(26, 1);
let button = new ToggleButton(20, 0);

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

    let workerData = {pathTemp: params.tempPath, pathTarget: params.hddPath, timeS: 10};
    const worker = new Worker('./task-timelapse.js', {workerData});
    worker.on('exit', (code) => {
        isCapturing = false;
        button.setState(0);
        led.setTime(1000, 0);
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
            led.setTime(1000, 0);
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

led.setTime(100, 1500);
button.onOn(() => {
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

button.onOff(() => {
    // stop
    LOG.info(`Stop capturing`);
    (async () => await stopRaspistillTask())();
});
