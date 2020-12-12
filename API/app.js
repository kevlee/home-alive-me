'use strict';


const OpenZWave = require('./lib/zwaveclient')

var DBClient
var task
const api = new (require('./lib/api.js'))
const tools = require('./lib/tools.js')
var emitters = require('./lib/globalemitters')



async function init() {
    let { err, connections } = await tools.launchregistreddevice()
    emitters.zwave.on('zwave connection', (zwave) => {
        if (DBClient) DBClient.closeconnection()
        DBClient = new (require('./lib/dbclient.js'))(zwave)
        api.connections.zwave = zwave
        task = new (require('./lib/task.js'))
    })

}

init()



process.on('SIGINT', function () {
    console.log('disconnecting...');
    connections.zwave.close();
    DBClient.closeconnection();
    process.exit();
});