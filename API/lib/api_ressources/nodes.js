'use strict'
const reqlib = require('app-root-path').require
const tools = reqlib('./lib/tools.js')
var result=""
const { 
  v4: uuidv4,
} = require('uuid');

function init(API) {


    API.post('/adddevice/', async (req, res) => {
        if (req.body.type) {
            let DBClient = new (reqlib('./lib/dbclient.js'))(null)
            global.devicetype = req.body.type
            let uuid = uuidv4()
            res.status(200).json({ 'msg': 'start enrolling', 'task_id': uuid })
            global.connections.zwave.startInclusion()
            result = await DBClient.inittask(() => { DBClient.closeconnection() }, uuid, "AddDevice")
        } else {
            res.status(400).send({ error: 'no type in query' })
        }
    })

    API.post('/removedevice/', async (req, res) => {
        let DBClient = new (reqlib('./lib/dbclient.js'))(null)
        let uuid = uuidv4()
        res.status(200).send({ 'msg': 'start removed', 'task_id': uuid })
        global.connections.zwave.startExclusion(true)
        result = await DBClient.inittask(() => { DBClient.closeconnection() }, uuid, "RemoveDevice")
    })

    API.get('/nodes/', async (req, res) => {
        let DBClient = new (reqlib('./lib/dbclient.js'))(null)
        let result
        result = await DBClient.getnodes()
        DBClient.closeconnection()
        res.status(200)
        return res.json(result);

    })

    API.get('/nodes/:uuid/config/', async (req, res) => {
        if (req.params.uuid) {
            let DBClient = new (reqlib('./lib/dbclient.js'))(null)
            result = await DBClient.getnodeconfig(() => { DBClient.closeconnection() }, req.params.uuid)
            res.status(200).json(result)
        } else {
            res.status(400).send({ error: 'no uuid in query' })
        }

    })

    API.get('/curtainlevel/:uuid/',async (req, res) => {
        if (req.params.uuid) {
            let DBClient = new (reqlib('./lib/dbclient.js'))(null)
            result = await DBClient.getcurtainlevel(() => { DBClient.closeconnection() }, req.params.uuid)
            res.status(200).json(result)
        } else {
            res.status(400).send({ error: 'no uuid in query' })
        }

    })

    API.post('/nodes/:uuid/data/', async (req, res) => {
        if (req.params.uuid) {
            tools.writedata(global.connections.zwave, req.body)
            res.status(200).json("OK")
        } else {
            res.status(400).send({ error: 'no uuid in query' })
        }

    })

    API.post('/nodes/:uuid/config/', async (req, res) => {
        if (req.params.uuid) {
            tools.writeconfig(global.connections.zwave,req.body)
            res.status(200).json("OK")
        } else {
            res.status(400).send({ error: 'no uuid in query' })
        }
    })

    API.post('/nodes/:uuid/room/',async (req, res) => {
        if (req.params.uuid && req.body.room) {
            let DBClient = new (reqlib('./lib/dbclient.js'))(null)
            await DBClient.setnoderoom(req.params.uuid,req.body.room)
            DBClient.closeconnection()
            res.status(200).json("OK")
        } else {
            res.status(400).send({ error: 'no uuid in query' })
        }

    })

    API.post('/nodes/:uuid/type/',async (req, res) => {
        if (req.params.uuid && req.body.type) {
            let DBClient = new (reqlib('./lib/dbclient.js'))(null)
            await DBClient.setnodetype(req.params.uuid,req.body.type)
            DBClient.closeconnection()
            res.status(200).json("OK")
        } else {
            res.status(400).send({ error: 'no uuid in query' })
        }

    })


}

module.exports = { init }