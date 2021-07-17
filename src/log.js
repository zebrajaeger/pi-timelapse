/*
This file is part of pi-timelapse / picam (https://github.com/zebrajaeger/pi-timelapse).

pi-timelapse is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

pi-timelapse is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See theGNU General Public License for more details.

You should have received a copy of the GNU General Public License along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

const log4js = require('log4js');

console.log("\x1b[0m"); // reset

log4js.configure({
    appenders: {
        out: {type: 'stdout'},
        app: {type: 'file', filename: 'application.log'}
    },
    categories: {
        default: {appenders: ['out', 'app'], level: 'debug'}
    },
    // levels: {
    //     INFO: { value: 20000, colour: 'white' }
    // }
});

module.exports = log4js;
