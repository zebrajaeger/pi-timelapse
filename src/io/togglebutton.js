/*
This file is part of pi-timelapse / picam (https://github.com/zebrajaeger/pi-timelapse).

pi-timelapse is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

pi-timelapse is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See theGNU General Public License for more details.

You should have received a copy of the GNU General Public License along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

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
