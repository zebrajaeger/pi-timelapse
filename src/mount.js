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
