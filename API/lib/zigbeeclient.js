/* eslint-disable camelcase */
'use strict'

// eslint-disable-next-line one-var

const { Controller } = require('zigbee-herdsman')
const { Device } = require("zigbee-herdsman/dist/controller/model")
const zhc = require('zigbee-herdsman-converters')
var emitters = require('./globalemitters')
const fs = require('fs')


var connected = false
var options = {}


// event
const EVENTS = {
    'controller':
    {
        message: message,
        adapterDisconnected : adapterDisconnected,
        deviceJoined : deviceJoined,
        deviceInterview : deviceInterview,
        deviceAnnounce : deviceAnnounce,
        deviceNetworkAddressChanged : deviceNetworkAddressChanged,
        deviceLeave : deviceLeave,
        permitJoinChanged : permitJoinChanged,
        lastSeenChanged : lastSeenChanged
    },
    'adapter':
    {
        zclData: zclData,
        rawData: rawData
    }
}

let DRIVER
let deviceLookup = {}

/**
 * The constructor
 */
function ZigbeeClient(config) {
    if (!(this instanceof ZigbeeClient)) {
        return new ZigbeeClient(config)
    }
    init.call(this, config)
}

async function init(cfg) {
    this.cfg = cfg
    this.joined = false


    try {
        console.log("Intiate zigbee")
        options = {
            serialPort: {
                adapter: 'ezsp',
                path: cfg.serialPort
            },
            databasePath: cfg.databasePath,
            databaseBackupPath: './config/config_zigbee/backup.db',
            backupPath: './config/config_zigbee/backup.json'
        }
        console.log(options)
        DRIVER = new Controller(options, cfg.logConfig.debug)


        Object.keys(EVENTS.controller).forEach(function (evt) {
            onEvent.bind(DRIVER, evt)
            DRIVER.on(evt, EVENTS.controller[evt].bind(DRIVER))
        })


    } catch (error) {
        console.log(error)
    }
}


// ---------- zigbee EVENTS -------------------------------------

// catch all events
function onEvent(name, ...args) {
    this.lastUpdate = Date.now()
    emitters.zigbee.on('event', name, ...args)
}

async function permitJoinChanged(data) {
    if (data.reason == 'timer_expired' && !this.joined) {
        emitters.zigbee.emit("No device find")
    }
}


async function deviceJoined(msg) {
    await DRIVER.greenPower.permitJoin(0, null);
    await DRIVER.adapter.permitJoin(0, null);

    this.joined = true

    var device = await zhc.findDefinition(msg.device)
    emitters.zigbee.emit("Node added", msg)
}

async function deviceInterview(data) {
    console.log("interview")
}

async function adapterDisconnected(data) {
}

async function deviceAnnounce(data) {
    var device = await zhc.findByDevice(msg.device)
}

async function deviceNetworkAddressChanged(data) {
}

async function deviceLeave(data) {
}

async function lastSeenChanged(data) {
    if (data.reason == "messageEmitted") {
        const device = zhc.findByDevice(data.device)
        
    }
}

async function message(msg) {

    if (msg) {
        var device = await zhc.findByDevice(msg.device)
        //set time on tuya
        if (device && device.hasOwnProperty("toZigbee")) {
            console.log(device)
        }
        if (msg.type === 'commandMcuSyncTime' && msg.cluster === 'manuSpecificTuya') {

            try {
                const offset = 0;
                const utcTime = Math.round(((new Date()).getTime() - offset) / 1000);
                const localTime = utcTime - (new Date()).getTimezoneOffset() * 60;
                const payload = {
                    payloadSize: 8,
                    payload: [
                        ...convertDecimalValueTo4ByteHexArray(utcTime),
                        ...convertDecimalValueTo4ByteHexArray(localTime),
                    ],
                };
                await msg.device.endpoints[0].command('manuSpecificTuya', 'mcuSyncTime', payload, {});
            } catch (error) {
                console.log(error)
            }
        }
    }

    if (msg.type != "commandDataReport") {
        console.log(msg)
    }

    if (device && msg.data.hasOwnProperty("dpValues")) {

        let value = await device.fromZigbee[0].convert(device, msg, msg.data, device.options, msg)
        console.log(Object.keys(value)[0])
        //console.log(device.exposes)
        let expose = device.exposes.find((i) => i["name"] == Object.keys(value)[0])
        console.log(value[Object.keys(value)[0]] + ' ' + expose['unit'] ) 
    }

    if (msg.type == "commandDataReport") {
        //console.log(msg)
        //console.log(device)
        //console.log(device.meta.tuyaDatapoints[0])
        console.log(await device.fromZigbee[0].convert(device, msg, msg.data, device.options, msg))
    }

}

async function zclData(zcl) {

    if (zcl.hasOwnProperty("frame") && zcl.frame.hasOwnProperty("Payload")) {
        console.log('payload ' + JSON.stringify(zcl.frame.Payload))
    }
}

async function rawData(data) {
    console.log(data.Cluster.commandsResponse)
}

async function resolveDevice(ieeeAddr) {
    if (!deviceLookup.hasOwnProperty(ieeeAddr)) {
        const device = DRIVER.getDeviceByIeeeAddr(ieeeAddr);
        device && (deviceLookup[ieeeAddr] = new Device(device));
    }

    const device = deviceLookup[ieeeAddr];
    if (device) {
        return device;
    }
}

function convertDecimalValueTo4ByteHexArray(value) {
    const hexValue = Number(value).toString(16).padStart(8, '0');
    const chunk1 = hexValue.substring(0, 2);
    const chunk2 = hexValue.substring(2, 4);
    const chunk3 = hexValue.substring(4, 6);
    const chunk4 = hexValue.substring(6);
    return [chunk1, chunk2, chunk3, chunk4].map((hexVal) => parseInt(hexVal, 16));
}

function convertDecimalValueTo2ByteHexArray(value) {
    const hexValue = Number(value).toString(16).padStart(4, '0');
    const chunk1 = hexValue.substring(0, 2);
    const chunk2 = hexValue.substring(2);
    return [chunk1, chunk2].map((hexVal) => parseInt(hexVal, 16));
}

/**
 * Method used to start ZigbeeClient connection using configuration `port`
 */
ZigbeeClient.prototype.connect = async function () {
    try {
        if (!this.connected) {
            console.log('Connecting to', this.cfg.serialPort)
            await DRIVER.start()
            this.connected = true
            Object.keys(EVENTS.adapter).forEach(function (evt) {
                onEvent.bind(DRIVER, evt)
                DRIVER.on(evt, EVENTS.adapter[evt].bind(DRIVER))
            })
            Object.keys(EVENTS.adapter).forEach(function (evt) {
                onEvent.bind(DRIVER.adapter, evt)
                DRIVER.adapter.on(evt, EVENTS.adapter[evt].bind(DRIVER.adapter))
            })

            const filestr = await fs.readFileSync(options.databasePath).toString().split('\n')
            var module = {}
            filestr.forEach(m => {
                const parsed = JSON.parse(m)
                module[parsed.id] = parsed
            })
            console.log(module)
            exit(0)

        } else {
            DRIVER.debug.log('Client already connected to', this.cfg.port)
        }
    } catch (error) { 
        console.log("failed to start USB Dongle :" + error)
        this.connected = false
    }
}

ZigbeeClient.prototype.startInclusion = async function () {
    this.joined = false
    try {
        let error = ""
        await DRIVER.permitJoin('true', null, this.cfg.commandsTimeout)
    } catch (error) {
        console.log(error)
    }

}

/* const meta = {
                endpoint_name: endpointName, options: entitySettingsKeyValue,
                message: {...message}, logger, device, state: entityState, membersState, mapped: definition,
            };*/


module.exports = ZigbeeClient

