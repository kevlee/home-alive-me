'use strict';



const OpenZWave = require('./lib/zwaveclient')

var DBClient
var task
const api = new (require('./lib/api.js'))
const tools = require('./lib/tools.js')
var emitters = require('./lib/globalemitters')
const env = require('dotenv-flow').config()



async function init() {
    let { err, connections } = await tools.launchregistreddevice(process.platform)
    emitters.zwave.on('zwave connection', function (zwave) {
        if (DBClient) DBClient.closeconnection()
        DBClient = new (require('./lib/dbclient.js'))(true)
        api.connections.zwave = zwave
    })
    emitters.zwave.on('scan complete', function (zwave) {
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