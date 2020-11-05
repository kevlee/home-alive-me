'use strict';

var OpenZWave = require('./lib/zwaveclient');
var zwave;

function zwaveconnect() {
    zwave = new OpenZWave({
        Logging: false,     // disable file logging (OZWLog.txt)
        ConsoleOutput: true, // enable console logging
        port: '\\\\.\\COM4'
    });
    zwave.connect();
}

zwaveconnect();


process.on('SIGINT', function () {
    console.log('disconnecting...');
    zwave.close();
    process.exit();
});
