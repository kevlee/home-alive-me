'use strict'
const reqlib = require('app-root-path').require
const { v4: uuidv4 } = require('uuid')
var result = ""

function init(API,connections) {
    API.post('/adddevice/', async (req, res) => {
        if (req.body.type) {
            let DBClient = new (reqlib('./lib/dbclient.js'))(null)
            global.devicetype = req.body.type
            let uuid = uuidv4()
            res.status(200).json({ 'msg': 'start enrolling', 'task_id': uuid })
            connections.zwave.startInclusion(true)
            result = await DBClient.inittask(() => { DBClient.closeconnection() }, uuid, "AddDevice")
        } else {
            res.status(400).send({ error: 'no type in query' })
        }
    })

    API.post('/removedevice/', async (req, res) => {
        let DBClient = new (reqlib('./lib/dbclient.js'))(null)
        let uuid = uuidv4()
        res.status(200).send({ 'msg': 'start removed', 'task_id': uuid })
        connections.zwave.startExclusion(true)
        result = await DBClient.inittask(() => { DBClient.closeconnection() }, uuid, "RemoveDevice")
    })

    API.post('/reset/', async (req, res) => {
        connections.zwave.client.hardReset()
        res.status(200).send({ "OK" })
    })


}

module.exports = { init }