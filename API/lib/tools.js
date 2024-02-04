/* eslint-disable camelcase */
'use strict'
const reqlib = require('app-root-path').require
const OpenZWave = reqlib('./lib/zwaveclient')
const Zigbee = reqlib('./lib/zigbeeclient')
const SerialPort = require('serialport').SerialPort


var config = {
    Logging: false,     // disable file logging (OZWLog.txt)
    ConsoleOutput: false, // enable console logging
    NetworkKey: "0xed,0x66,0x77,0xc8,0xb8,0xac,0xbb,0x3c,0x94,0x85,0x4f,0xc6,0x52,0xca,0x1b,0x94",
    commandsTimeout: 30, // set time to 30 second
    ConfigPath: './config/config/'
}

function writeconfig(zwaveclient, configs) {
    
    for (var [index, config] of Object.entries(configs)) {
        let valueid = config.valueid.split('-')
        let ozwnodeId = valueid[0]
        let valueId = {
            "commandClass": parseInt(valueid[1]),
            "endpoint": parseInt(valueid[2]),
            "property": parseInt(valueid[3])
        }
        zwaveclient.writeValue(ozwnodeId, valueId, config.value)
    }
}

function writedata(zwaveclient, data) {
    let valueid = data.valueid.split('-')
    let ozwnodeId = valueid[0]
    let valueId = {
        "commandClass": parseInt(valueid[1]),
        "endpoint": parseInt(valueid[2]),
        "property": valueid[3],
    }
    zwaveclient.writeValue(ozwnodeId, valueId, data.value)
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

    try {
        if (type != "zwave" && type != "zigbee") {
            err = 'device not supported'
            return { err, portconfig, type }
        }
        switch (os) {
            case 'win32':
                portconfig = port
                break
            case 'linux':
                portconfig = port
                break
            case 'darwin':
                portconfig = port.replace('tty', 'cu')
                break
            default:
        }
    
        if (global.connections.hasOwnProperty('zwave') && global.connections.zwave) {
            config = global.connections.zwave.cfg
            global.connections.zwave.close()

        }

        if (global.connections.hasOwnProperty('zigbee') && global.connections.zigbee) {
            config = global.connections.zigbee.cfg
            global.connections.zigbee.close()
        }
        switch (type) {
            case 'zwave':
                config.port = portconfig
                global.connections.zwave = new OpenZWave(config)
                global.connections.zwave.connect()
                break
            case 'zigbee':
                config.port = portconfig
                global.connections.zigbee = new Zigbee(config)
                global.connections.zigbee.connect()
                break
            default:

        }
    } catch (error) {
        console.log(error)
    }
    return { err, portconfig, type, connections }
    
    
}

async function launchregistreddevice() {
    var err = null
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
                        switch (process.platform) {
                            case 'win32':
                                portconfig =  obj.port
                                break
                            case 'linux':
                                portconfig = obj.port
                                break
                            case 'darwin':
                                portconfig = obj.port.replace('tty', 'cu')
                                break
                            default:
                        }
                        try {
                            global.connections.zwave = new OpenZWave({
                                logConfig: {
                                    enabled: false,
                                    level: "debug"
                                },
                                ConsoleOutput: false, // enable console logging
                                NetworkKey: "0xed,0x66,0x77,0xc8,0xb8,0xac,0xbb,0x3c,0x94,0x85,0x4f,0xc6,0x52,0xca,0x1b,0x94",
                                port: portconfig,
                                commandsTimeout: 30, // set time to 30 second
                                ConfigPath: './config/config/'
                            })
                        
                            global.connections.zwave.connect()
                        }
                        catch (error) {
                            console.log(error)
                        }
                        
                    }
                    break
                case 'zigbee':

                    if (availabledevice.includes(obj.port)) {
                        var portconfig = null
                        switch (process.platform) {
                            case 'win32':
                                portconfig = obj.port
                                break
                            case 'linux':
                                portconfig = obj.port
                                break
                            case 'darwin':
                                portconfig = obj.port.replace('tty', 'cu')
                                break
                            default:
                        }
                        try {
                            global.connections.zigbee = new Zigbee({
                                logConfig: {
                                    enabled: false,
                                    level: "debug"
                                },
                                ConsoleOutput: false, // enable console logging
                                serialPort: portconfig,
                                commandsTimeout: 30, // set time to 30 second
                                databasePath: './config/config_zigbee/device.db'
                            })
                            await global.connections.zigbee.connect()
                            await global.connections.zigbee.startInclusion()
                        } catch (error) {
                            console.log(error)
                        }
                    }
                    
                    break
                default:
                    err = 'module config not supported yet'
            }
        }
    }
    return err
}


module.exports = {
    writeconfig,
    writedata,
    getusblist,
    setport,
    launchregistreddevice
}