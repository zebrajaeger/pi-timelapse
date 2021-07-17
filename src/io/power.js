/*
This file is part of pi-timelapse / picam (https://github.com/zebrajaeger/pi-timelapse).

pi-timelapse is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

pi-timelapse is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See theGNU General Public License for more details.

You should have received a copy of the GNU General Public License along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

const Gpio = require('onoff').Gpio;

module.exports = class Power {
    constructor(gpioPin, enabled) {
        this.gpio = new Gpio(gpioPin, 'out');
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
