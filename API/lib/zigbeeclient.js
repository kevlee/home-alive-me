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
        DRIVER["nodes"] = {}

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

        if (DRIVER.nodes[msg.device.ID] && !DRIVER.nodes[msg.device.ID].hasOwnProperty("device")) {
            DRIVER.nodes[msg.device.ID]=Object.assign({}, DRIVER.nodes[msg.device.ID], { zhcdevice: device },)
        }
        //set time on tuya
        if (device && device.hasOwnProperty("toZigbee")) {
            //console.log(device)
        }
        // sync time Tuya
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


    if (device
        && device.hasOwnProperty("fromZigbee")
        && device.fromZigbee[0].type.includes(msg.type)) {
        const meta = {
            message: { ...msg },
            device: device,
            mapped: device
        }

        let value = await device.fromZigbee[0].convert(device, msg, null, device.options, meta)
        const e = device.exposes.find((i) => i["property"] === Object.keys(value)[0])
        value["meta"] = e
        value["value"] = value[Object.keys(value)[0]]
        DRIVER.nodes[msg.device.ID]["data"] = Object.assign({}, DRIVER.nodes[msg.device.ID]["data"], value)
        if (value.meta && value.value) {
            emitters.zigbee.emit("data change", DRIVER.nodes[msg.device.ID], device, value)
        }
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
            await DRIVER.start()
            emitters.zigbee.emit("zigbee connection", this)
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
            filestr.forEach(async (m) => {
                const parsed = JSON.parse(m)
                DRIVER.nodes[parsed.id] = parsed
                const zhdevice = DRIVER.getDeviceByIeeeAddr(DRIVER.nodes[parsed.id].ieeeAddr)
                const zhcdevice = await zhc.findByDevice(zhdevice)
                //if (parsed.id != 1 && zhcdevice.hasOwnProperty('configure') ) {
                //    await zhcdevice.configure(zhdevice, DRIVER.nodes[1].endpoints['1'], null)
                //}
                
                emitters.zigbee.emit("node loaded", parsed)
            })
            emitters.zigbee.emit("scan completed", this)
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

ZigbeeClient.prototype.writeValue = async function (nodeId, config, value) {
    let id = nodeId.split('-')
    if (this.connected
        && DRIVER.nodes[id[0]]) {
        try {
            const zhdevice = await DRIVER.getDeviceByIeeeAddr(DRIVER.nodes[id[0]].ieeeAddr)
            const zhcdevice = await zhc.findByDevice(zhdevice)
            zhdevice.meta.configured = zhc.getConfigureKey(zhcdevice);
            console.log(zhdevice)
            if (zhcdevice.hasOwnProperty("toZigbee")
                && zhcdevice.toZigbee[0].key.find((i) => i == config.valueid)) {
                var message = {}
                message[config.valueid] = value
                const meta = {
                    endpoint_name: config.valueid,
                    message: {... message },
                    mapped: zhcdevice,
                    device: zhdevice,
                    options: {
                        legacy: false,
                        friendly_name: '0xa4c138124b10f08f',
                        ID: '0xa4c138124b10f08f'
                   }
                }
                await zhcdevice.configure(meta.device, DRIVER.nodes[1].endpoints[0], null)
                console.log(await zhcdevice.toZigbee[0].convertSet(
                    meta.device.endpoints[0],
                    config.valueid,
                    config,
                    meta
                ))

                

            }
        } catch (error) {
            console.log(
                `Error while writing ${value} on ${nodeId}: ${error.message}`
            )
        }
    }
}

/* const meta = {
                endpoint_name: endpointName, options: entitySettingsKeyValue,
                message: {...message}, logger, device, state: entityState, membersState, mapped: definition,
            };*/


module.exports = ZigbeeClient

