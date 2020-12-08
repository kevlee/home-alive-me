/* eslint-disable camelcase */
'use strict'


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
    console.log(port)
    return port
}


module.exports = { writeconfig, writedata, getusblist }