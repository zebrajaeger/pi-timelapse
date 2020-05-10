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
