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



