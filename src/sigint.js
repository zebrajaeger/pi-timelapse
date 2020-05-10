// thx to https://stackoverflow.com/questions/10021373/what-is-the-windows-equivalent-of-process-onsigint-in-node-js
module.exports = (cb) => {
    if (process.platform === "win32") {
        let rl = require("readline").createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.on("SIGINT", function () {
            process.emit("SIGINT");
        });
    }

    process.on("SIGINT", function () {
        //graceful shutdown
        if (cb) {
            cb();
        }
        process.exit();
    });
};
