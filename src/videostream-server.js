const LOG = require('./log').getLogger('Server');
const os = require('os');
const {performance} = require('perf_hooks');

const {Codec, StreamCamera} = require("pi-camera-connect");

const {Subject} = require('rxjs');

const express = require('express')
const app = express();

function getIPs() {
    const networkInterfaces = Object
        .entries(os.networkInterfaces())
        .sort((a, b) => b[0].localeCompare(a[0]));

    const result = [];
    for (const [key, value] of networkInterfaces) {
        for (const x of value) {
            if (!x.internal) {
                x['name'] = key;
                result.push(x);
            }
        }
    }

    return result;
}

const streamCamera = new StreamCamera({codec: Codec.MJPEG});

const frameSubject = new Subject();

async function init(port = 3000) {
    app.get('/stream.mjpg', (req, res) => {
        res.writeHead(200, {
            'Cache-Control': 'no-store, no-cache, must-revalidate, pre-check=0, post-check=0, max-age=0',
            Pragma: 'no-cache',
            Connection: 'close',
            'Content-Type': 'multipart/x-mixed-replace; boundary=--myboundary'
        });

        let isReady = true;
        req.subscription = frameSubject.subscribe(frame => {
            if (isReady) {
                isReady = false;
                res.write(`--myboundary\nContent-Type: image/jpg\nContent-length: ${frame.length}\n\n`);
                res.write(frame, function () {
                    isReady = true;
                });
            }
        });

        req.on('close', () => {
            req.subscription.unsubscribe();
            LOG.debug('Connection terminated: ' + req.hostname);
        });

        LOG.debug('Accepting connection: ' + req.hostname);
    });

    app.use(express.static(__dirname + '/public'));

    app.listen(port, () => {
        let ips = getIPs();
        for (const ip of ips) {
            LOG.info(`Stream running on http://${ip.address}:${port} (${ip.name}, ${ip.family})`)
        }
    });
}

let stopRequest = false;
let running = false;

async function capture() {
    async function capture_() {
        if (stopRequest) {
            running = false;
            return;
        }
        setTimeout(async () => {
            const t1 = performance.now()
            const img = await streamCamera.takeImage()
            const t2 = performance.now()
            LOG.trace(`Capture image took ${(t2 - t1).toFixed(1)} ms`);
            frameSubject.next(img);
            await capture_();
        }, 10)
    }

    return capture_();
}

async function start() {
    if (running) {
        LOG.warn('Already running');
        return;
    }
    stopRequest = false;
    await streamCamera.startCapture();
    await capture();
}

async function stop() {
    if (!running) {
        LOG.warn('Already stopped');
    }
    stopRequest = true;
    await streamCamera.stopCapture();
}

module.exports = {init, start, stop}
