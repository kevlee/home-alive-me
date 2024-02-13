const EventEmitter = require('events')
const zwave = new EventEmitter()
const zigbee = new EventEmitter({ captureRejections: true })

module.exports = {
    zwave,
    zigbee
}