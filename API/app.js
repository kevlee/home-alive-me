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
        DBClient = new (require('./lib/dbclient.js'))(true)
        api.connections.zwave = zwave
        task = new (require('./lib/task.js'))
    })
    emitters.zwave.on('scan complete', function (zwave) {
        zwave.client.requestAllConfigParams(8)
        zwave.client.requestAllConfigParams(7)
        zwave.client.requestAllConfigParams(4)
    })

}

init()



process.on('SIGINT', function () {
    console.log('disconnecting...');
    connections.zwave.close();
    DBClient.closeconnection();
    process.exit();
});