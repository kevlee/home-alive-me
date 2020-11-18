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
        port: '\\\\.\\COM4'
    });
    zwave.connect();
    DBClient = new (require('./lib/dbclient.js'))(zwave); 
}

zwaveconnect()
//task = new (require('./lib/task.js'));
api = new(require('./lib/api.js'))

/*api.listen(80, () =>
    console.log(`Example app listening on port ${process.env.PORT}!`),
);

api.get('/test', (req, res) => {
    return res.send('GET HTTP test');
})*/


process.on('SIGINT', function () {
    console.log('disconnecting...');
    zwave.close();
    DBClient.closeconnection();
    process.exit();
});
