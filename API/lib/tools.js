/* eslint-disable camelcase */
'use strict'
const reqlib = require('app-root-path').require
const OpenZWave = reqlib('./lib/zwaveclient')
const SerialPort = require('serialport')


var config = {
    Logging: false,     // disable file logging (OZWLog.txt)
    ConsoleOutput: false, // enable console logging
    NetworkKey: "0xed,0x66,0x77,0xc8,0xb8,0xac,0xbb,0x3c,0x94,0x85,0x4f,0xc6,0x52,0xca,0x1b,0x94",
    commandsTimeout: 30, // set time to 30 second
    ConfigPath: './config/config/'
}

function writeconfig(zwavecontroler,configs) {
    for (var [index, config] of Object.entries(configs)) {
        let valueid = config.valueid.split('-')
        zwavecontroler.writeValue({ node_id: valueid[0], class_id: valueid[1], instance: valueid[2], index: valueid[3]}, config.value)
    }
}

function writedata(zwavecontroler, data) {
    let valueid = data.valueid.split('-')
    zwavecontroler.writeValue({ node_id: valueid[0], class_id: valueid[1], instance: valueid[2], index: valueid[3] }, data.value)
}

async function getusblist() {

    let port = await SerialPort.list()
    var tabport = port.map(obj => {
        var rObj = [];
        rObj = obj.path
        return rObj;
    });
    return tabport
}

function setport(type, port, os, connections) {
    let portconfig = null
    let err = null
    if (type != "zwave") {
        err = 'device not supported'
        return { err, portconfig, type }
    }
    switch (os) {
        case 'win32':
            portconfig = '\\\\.\\' + port
            break
        case 'linux':
            portconfig = port
            break
        case 'darwin':
            portconfig = port.replace('tty', 'cu')
            break
        default:
    }

    if (connections.hasOwnProperty('zwave') && connections.zwave) {
        config = connections.zwave.cfg
        connections.zwave.close()
        
    }
    config.port = portconfig
    connections.zwave = new OpenZWave(config)
    connections.zwave.connect()
    return { err, portconfig, type, connections }
    
    
}

async function launchregistreddevice(os) {
    var connections = {},
        err = null
    let DBClient = new (reqlib('./lib/dbclient.js'))(null)
    let modules = await DBClient.getmodulesconfigs()
    DBClient.closeconnection()
    let availabledevice = await getusblist()
    if (modules.length > 0) {
        for (var obj of modules) {
            switch (obj.type) {
                case 'zwave':
                    if (availabledevice.includes(obj.port)) {
                        var portconfig = null
                        switch (os) {
                            case 'win32':
                                portconfig = '\\\\.\\' + obj.port
                                break
                            case 'linux':
                                portconfig = obj.port
                                break
                            default:
                        }
                        connections.zwave = new OpenZWave({
                            Logging: false,     // disable file logging (OZWLog.txt)
                            ConsoleOutput: false, // enable console logging
                            NetworkKey: "0xed,0x66,0x77,0xc8,0xb8,0xac,0xbb,0x3c,0x94,0x85,0x4f,0xc6,0x52,0xca,0x1b,0x94",
                            port: portconfig,
                            commandsTimeout: 30, // set time to 30 second
                            ConfigPath: './config/config/'
                        })
                        connections.zwave.connect()
                        console.log(connections)
                    }
                    break
                default:
                    err = 'module config not supported yet'
            }
        }
    }
    return { err, connections}
}


module.exports = {
    writeconfig,
    writedata,
    getusblist,
    setport,
    launchregistreddevice
}