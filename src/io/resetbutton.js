/*
This file is part of pi-timelapse / picam (https://github.com/zebrajaeger/pi-timelapse).

pi-timelapse is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

pi-timelapse is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See theGNU General Public License for more details.

You should have received a copy of the GNU General Public License along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

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
