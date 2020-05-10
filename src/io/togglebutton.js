const Gpio = require('onoff').Gpio;

module.exports = class ToggleButton {
    constructor(gpioPin, buttonState) {
        this.gpio = new Gpio(gpioPin, 'out');
        this.buttonState = buttonState;
        this.onCallback = null;
        this.offCallback = null;
        this.toggleCallback = null;
        const button = new Gpio(gpioPin, 'in', 'rising', {debounceTimeout: 50});
        button.watch((err, value) => {
            if (err) {
                throw err;
            } else {
                this.buttonState = !this.buttonState;
                this.sendEvents(this.buttonState);
            }
        });
    }

    sendEvents(state) {
        if (this.toggleCallback) {
            this.toggleCallback(state);
        }
        if (state) {
            if (this.onCallback) {
                this.onCallback();
            }
        } else {
            if (this.offCallback) {
                this.offCallback();
            }
        }
    }

    onOn(callback) {
        this.onCallback = callback;
    }

    onOff(callback) {
        this.offCallback = callback;
    }

    onToggle(callback) {
        this.toggleCallback = callback;
    }

    setState(state) {
        let oldState = this.buttonState;
        this.buttonState = state;
        return oldState;
    }

    getState(state) {
        this.buttonState = state;
    }
};
