'use strict';



const OpenZWave = require('./lib/zwaveclient')

var DBClient
var task
const api = new (require('./lib/api.js'))
const tools = require('./lib/tools.js')
var emitters = require('./lib/globalemitters')
const env = require('dotenv-flow').config()


global.connections = {}



function init() {

   
    emitters.zwave.on('zwave connection', function (zwave) {
        if (DBClient) DBClient.closeconnection()
        DBClient = new (require('./lib/dbclient.js'))(true)
        global.connections.zwave = zwave
    })

    

    emitters.zwave.on('scan complete', function (zwave) {
        task = new (require('./lib/task.js'))
    })

    

}

try {
    init()
}
catch (error) {
    console.error(error)
}





process.on('SIGINT', function () {
    console.log('disconnecting...');
    connections.zwave.close();
    DBClient.closeconnection();
    process.exit();
});