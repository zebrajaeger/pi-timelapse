const Gpio = require('onoff').Gpio;

module.exports = class Led {
    constructor(gpioPin) {
        this.gpio = new Gpio(gpioPin, 'out');
        this.ledOnTimeMs = 0;
        this.ledOffTimeMs = 0;
        this.ledTimerHandle = null;
    }

    setTime(onMs, offMs) {
        if (this.ledTimerHandle) {
            clearTimeout(this.ledTimerHandle);
        }
        this.ledOnTimeMs = onMs;
        this.ledOffTimeMs = offMs;
        this.gpio.writeSync(0);
        this.ledTrigger(0, this.ledOffTimeMs);
    }

    setDuty(frequency, dutyCycle) {
        if (this.ledTimerHandle) {
            clearTimeout(this.ledTimerHandle);
        }
        let t = 1000 / frequency;
        this.ledOnTimeMs = t * dutyCycle;
        this.ledOffTimeMs = t - this.ledOnTimeMs;
        this.gpio.writeSync(0);
        this.ledTrigger(0, this.ledOffTimeMs);
    }

    ledTrigger(ledStateAfterTimeout, timeOutImeMs) {
        // console.log(ledStateAfterTimeout, timeOutImeMs)
        this.ledTimerHandle = setTimeout(_ => {
            this.gpio.writeSync(ledStateAfterTimeout);
            if (ledStateAfterTimeout) {
                this.ledTrigger(0, this.ledOnTimeMs);
            } else {
                this.ledTrigger(1, this.ledOffTimeMs);
            }
        }, timeOutImeMs);
    }
};
