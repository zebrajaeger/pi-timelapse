const LOG = require('../log').getLogger('ResetButton');

const Gpio = require('onoff').Gpio;

module.exports = class ResetButton {
    constructor(gpioPin, timeoutMs) {
        this.gpio = new Gpio(gpioPin, 'out');
        this.resetCallback = null;
        this.timeOutMs = timeoutMs;
        this.timer = null;
        const button = new Gpio(gpioPin, 'in', 'both', {debounceTimeout: 100});
        button.watch((err, value) => {
            if (err) {
                throw err;
            } else {
                if (value) {
                    if (this.timer) {
                        clearTimeout(this.timer);
                    }
                    LOG.debug(`Start Timer with ${this.timeOutMs}ms`);
                    this.timer = setTimeout(() => {
                        this.timer = null;
                        LOG.debug('onReset');
                        if (this.resetCallback) {
                            this.resetCallback();
                        }
                    }, this.timeOutMs);
                } else {
                    if (this.timer) {
                        LOG.debug('Stop Timer');
                        clearTimeout(this.timer);
                    }
                }
                this.buttonState = !this.buttonState;
            }
        });
    }

    onReset(callback) {
        this.resetCallback = callback;
    }
}
