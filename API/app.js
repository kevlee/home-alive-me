'use strict';


const OpenZWave = require('./lib/zwaveclient')

var DBClient
var task
const api = new (require('./lib/api.js'))
const tools = require('./lib/tools.js')




async function init() {
    let { err, connections } = await tools.launchregistreddevice(eventEmitter)
    api.connections.zwave = connections.zwave

    eventEmitter.on('zwave connection', (() => {
        if (DBClient) DBClient.closeconnection()
        DBClient = new (require('./lib/dbclient.js'))(connections.zwave)
        task = new (require('./lib/task.js'))
    }))

}

init()



process.on('SIGINT', function () {
    console.log('disconnecting...');
    connections.zwave.close();
    DBClient.closeconnection();
    process.exit();
});