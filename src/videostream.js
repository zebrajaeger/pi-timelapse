// a modified version of https://github.com/caseymcj/raspberrypi_node_camera_web_streamer

const LOG = require('./log').getLogger('Videostream');

const raspberryPiCamera = require('raspberry-pi-camera-native');

const lastFrameObj = {
    lastFrame: null
};

const videoStream = {
    start: (cameraOptions) => {
        if (!cameraOptions) {
            cameraOptions = {
                width: 1280,
                height: 720,
                fps: 16,
                encoding: 'JPEG',
                quality: 7
            };
        }
        raspberryPiCamera.start(cameraOptions);
        LOG.debug('Camera started.');
    },
    stop: () => {
        raspberryPiCamera.stop();
        LOG.debug('Camera stopped.');
    },
    getLastFrame: () => {
        return lastFrameObj.lastFrame;
    },
    acceptConnections: function (expressApp, cameraOptions, resourcePath) {
        if (typeof resourcePath === 'undefined' || !resourcePath) {
            resourcePath = '/stream.mjpg';
        }

        expressApp.get(resourcePath, (req, res) => {

            res.writeHead(200, {
                'Cache-Control': 'no-store, no-cache, must-revalidate, pre-check=0, post-check=0, max-age=0',
                Pragma: 'no-cache',
                Connection: 'close',
                'Content-Type': 'multipart/x-mixed-replace; boundary=--myboundary'
            });

            LOG.debug('Accepting connection: ' + req.hostname);

            // add frame data event listener

            let isReady = true;

            let frameHandler = (frameData) => {
                try {
                    if (!isReady) {
                        return;
                    }

                    isReady = false;

                    LOG.trace('Writing frame: ' + frameData.length);

                    lastFrameObj.lastFrame = frameData;

                    res.write(`--myboundary\nContent-Type: image/jpg\nContent-length: ${frameData.length}\n\n`);
                    res.write(frameData, function () {
                        isReady = true;
                    });
                } catch (ex) {
                    LOG.error('Unable to send frame: ' + ex);
                }
            }

            let frameEmitter = raspberryPiCamera.on('frame', frameHandler);

            req.on('close', () => {
                frameEmitter.removeListener('frame', frameHandler);
                LOG.debug('Connection terminated: ' + req.hostname);
            });
        });
    }
}

module.exports = videoStream;
