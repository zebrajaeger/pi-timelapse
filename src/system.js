const LOG = require('./log').getLogger('system');

const fsutils = require('./fsutils')

function shutdown() {
    return fsutils.execCmd('sudo shutdown -h now');
}

function reboot() {
    return fsutils.execCmd('sudo reboot');
}

module.exports = {
    shutdown: shutdown,
    reboot: reboot
};
