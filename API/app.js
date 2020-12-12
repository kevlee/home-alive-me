'use strict';


const OpenZWave = require('./lib/zwaveclient')

var DBClient
var task
const api = new (require('./lib/api.js'))
const tools = require('./lib/tools.js')



async function init() {
    let { err, connections } = await tools.launchregistreddevice()
    
    DBClient = new (require('./lib/dbclient.js'))(connections.zwave)
    api.connections.zwave = connections.zwave
    task = new (require('./lib/task.js'))
}

init()



process.on('SIGINT', function () {
    console.log('disconnecting...');
    zwave.close();
    DBClient.closeconnection();
    process.exit();
});