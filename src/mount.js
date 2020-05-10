/*
This file is part of pi-timelapse / picam (https://github.com/zebrajaeger/pi-timelapse).

pi-timelapse is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

pi-timelapse is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See theGNU General Public License for more details.

You should have received a copy of the GNU General Public License along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

const { exec } = require('child_process');

function Mount() {

    let regexLine = /^(.+)\s+on\s+(.+)\s+type\s+(.+)\s+\(([^\)]*)\)/;
    let regexOption = /([^=]+)(?:=(.*))?/;

    function getMount() {
        return new Promise(resolve => {
            exec('mount', (err, stdout) => {
                let result = [];
                stdout.split('\n').forEach(l => {
                    if (l) {
                        let matchLine = regexLine.exec(l);

                        let drive = {};
                        drive['device'] = matchLine[1];
                        drive['mountpoint'] = matchLine[2];
                        drive['type'] = matchLine[3];

                        let options = {};
                        matchLine[4].split(',').forEach(o => {
                            let matchOption = regexOption.exec(o);
                            options[matchOption[1]] = matchOption[2];
                        });

                        drive['options'] = options;
                        result.push(drive);
                    }
                });
                resolve(result);
            });
        });
    }

    function findByMountpoint(mountpoint) {
        return new Promise(resolve => {
            getMount().then(m => {
                Object.values(m).forEach(v => {
                    if (v.mountpoint === mountpoint) {
                        resolve(v);
                    }
                })
                resolve(null);
            });
        });
    }

    function isMounted(mountpoint) {
        return new Promise(resolve => {
            findByMountpoint(mountpoint).then(mp => {
                resolve(mp !== null);
            })
        })
    }

    return {
        getMount: getMount,
        findByMountpoint: findByMountpoint,
        isMounted: isMounted
    };
}

module.exports = Mount();
