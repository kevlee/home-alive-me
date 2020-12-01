/* eslint-disable camelcase */
'use strict'

function writeconfig(zwavecontroler,configs) {
    for (var [index, config] of Object.entries(configs)) {
        let valueid = config.valueid.split('-')
        zwavecontroler.writeValue({ node_id: valueid[0], class_id: valueid[1], instance: valueid[2], index: valueid[3]}, config.value)
    }
}

module.exports = { writeconfig }