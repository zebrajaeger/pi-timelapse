const Gpio = require('onoff').Gpio;

module.exports = class Power {
    constructor(gpioPin, enabled) {
        this.gpio = new Gpio(gpioPin, 'out');
        this.set(enabled);
    }

    set(enabled) {
        this.gpio.writeSync(enabled);
    }

    setOn() {
        this.set(1);
    }

    setOff() {
        this.set(0);
    }
};
