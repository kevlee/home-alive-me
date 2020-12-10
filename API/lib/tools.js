/* eslint-disable camelcase */
'use strict'

var OpenZWave = require('./zwaveclient')
var SerialPort = require('serialport')

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
    console.log(tabport)
    return tabport
}

function setport(type, port, os, zwave) {
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
        default:
    }

    zwave.close()
    zwave.cfg.port = portconfig
    zwave = new OpenZWave(zwave.cfg)
    zwave.connect()
    return { err, portconfig, type }
    
    
}


module.exports = { writeconfig, writedata, getusblist, setport }