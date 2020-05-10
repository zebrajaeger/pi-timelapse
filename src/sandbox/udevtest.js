/*
This file is part of pi-timelapse / picam (https://github.com/zebrajaeger/pi-timelapse).

pi-timelapse is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

pi-timelapse is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See theGNU General Public License for more details.

You should have received a copy of the GNU General Public License along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

const usbDetect = require('usb-detection');

usbDetect.startMonitoring();

// Detect add/insert
usbDetect.on('add', function (device) {
    console.log('add', device);
});
usbDetect.on('remove', function (device) {
    console.log('remove', device);
});

// // Get a list of USB devices on your system, optionally filtered by `vid` or `pid`
// usbDetect.find(function (err, devices) {
//     console.log('find', devices, err);
// });

// Promise version of `find`:
usbDetect.find().then(function (devices) {
    console.log(devices);
}).catch(function (err) {
    console.log(err);
});



