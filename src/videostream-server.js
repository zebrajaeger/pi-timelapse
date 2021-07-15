// a modified version of https://github.com/caseymcj/raspberrypi_node_camera_web_streamer/blob/master/index.js

const LOG = require('./log').getLogger('Server');

const express = require('express')
const videoStream = require('./videostream');

const app = express();
const port = 3000;

videoStream.acceptConnections(app, {
        width: 1280,
        height: 720,
        fps: 16,
        encoding: 'JPEG',
        quality: 7 // lower is faster, less quality
    },
    '/stream.mjpg', true);

app.use(express.static(__dirname + '/public'));
app.listen(port, () => LOG.info(`Example app listening on port ${port}! In your web browser, navigate to http://<IP_ADDRESS_OF_THIS_SERVER>:3000`));

function start() {
    videoStream.start();
}

function stop() {
    videoStream.stop();
}

module.exports = {start, stop}
