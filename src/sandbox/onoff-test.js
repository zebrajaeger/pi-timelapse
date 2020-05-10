/*
This file is part of pi-timelapse / picam (https://github.com/zebrajaeger/pi-timelapse).

pi-timelapse is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

pi-timelapse is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See theGNU General Public License for more details.

You should have received a copy of the GNU General Public License along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

const Gpio = require('onoff').Gpio; // Gpio class

// switch
const vcc = new Gpio(26, 'out');
vcc.writeSync(1);
const button = new Gpio(20, 'in', 'both', {debounceTimeout: 50});
button.watch((err, value) => {
    if (err) {
        LOG.debug("BUTTON " + er)
    } else {
        LOG.debug("BUTTON " + value)
    }
});

// LED
const led = new Gpio(21, 'out');
setInterval(_ => {
    let x = led.readSync();
    console.log(x);
    led.writeSync(led.readSync() ^ 1);
}, 500);

// on exit release resources
require('./sigint')(() => {
    console.log('STOP');
    if (led) {
        led.unexport();
    }
    if (vcc) {
        vcc.unexport();
    }
    if (button) {
        button.unexport();
    }
});
