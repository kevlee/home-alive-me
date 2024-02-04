/* eslint-disable camelcase */
'use strict'

// eslint-disable-next-line one-var

const { Controller } = require('zigbee-herdsman')
var emitters = require('./globalemitters')

let DRIVER

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

    try {
        console.log("Intiate zigbee")
        const options = {
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

        DRIVER.on('message', async (msg) => {
            console.log(msg)
        })

        
    } catch (error) {
        console.log(error)
    }
}

/**
 * Method used to start ZigbeeClient connection using configuration `port`
 */
ZigbeeClient.prototype.connect = async function () {
    if (!this.connected) {
        console.log('Connecting to', this.cfg.serialPort)
        await DRIVER.start()
        this.connected = true
        
    } else {
        console.log('Client already connected to', this.cfg.port)
    }
}

ZigbeeClient.prototype.startInclusion = async function () {
    DRIVER.permitJoin(600)
}

module.exports = ZigbeeClient

