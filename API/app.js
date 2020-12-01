'use strict';


var OpenZWave = require('./lib/zwaveclient')
var zwave
var DBClient
var task
var api



function zwaveconnect() {
    zwave = new OpenZWave({
        Logging: false,     // disable file logging (OZWLog.txt)
        ConsoleOutput: false, // enable console logging
        NetworkKey: "0xed,0x66,0x77,0xc8,0xb8,0xac,0xbb,0x3c,0x94,0x85,0x4f,0xc6,0x52,0xca,0x1b,0x94",
        port: '\\\\.\\COM4',
        commandsTimeout: 30, // set time to 30 second
        ConfigPath : './config'
    })
    zwave.connect();
    DBClient = new (require('./lib/dbclient.js'))(zwave)
    api = new (require('./lib/api.js'))(zwave)
    task = new (require('./lib/task.js'))
}

zwaveconnect()



process.on('SIGINT', function () {
    console.log('disconnecting...');
    zwave.close();
    DBClient.closeconnection();
    process.exit();
});