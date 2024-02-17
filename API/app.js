'use strict';



const OpenZWave = require('./lib/zwaveclient')

var DBClient
var launch=0
var task
const api = new (require('./lib/api.js'))
const tools = require('./lib/tools.js')
var emitters = require('./lib/globalemitters')
const env = require('dotenv-flow').config()


global.connections = {}



function init() {

   
    emitters.zwave.on('zwave connection', function (zwave) {
        if (launch == 0) {
            if (DBClient) DBClient.closeconnection()
            DBClient = new (require('./lib/dbclient.js'))(true)
            launch = 1
        }
        global.connections.zwave = zwave
    })

    emitters.zigbee.on('zigbee connection', function (zigbee) {
        if(launch == 0) {
            if (DBClient) DBClient.closeconnection()
            DBClient = new (require('./lib/dbclient.js'))(true)
            launch = 1
        }
        global.connections.zigbee = zigbee
    })

    

    emitters.zwave.on('scan complete', function (zwave) {
        if (!task) {
            task = new (require('./lib/task.js'))
        }
    })

    emitters.zigbee.on('scan complete', function (zwave) {
        if (!task) {
            task = new (require('./lib/task.js'))
        }
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