/*
This file is part of pi-timelapse / picam (https://github.com/zebrajaeger/pi-timelapse).

pi-timelapse is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

pi-timelapse is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See theGNU General Public License for more details.

You should have received a copy of the GNU General Public License along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

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
