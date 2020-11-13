'use strict';


var OpenZWave = require('./lib/zwaveclient');
var zwave;
var DBClient;



function zwaveconnect() {
    zwave = new OpenZWave({
        Logging: false,     // disable file logging (OZWLog.txt)
        ConsoleOutput: false, // enable console logging
        port: '\\\\.\\COM4'
    });
    zwave.connect();
    DBClient = new (require('./lib/dbclient.js'))(zwave); 
}

zwaveconnect()


process.on('SIGINT', function () {
    console.log('disconnecting...');
    zwave.close();
    process.exit();
});
