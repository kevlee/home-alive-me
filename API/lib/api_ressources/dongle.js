'use strict'
const reqlib = require('app-root-path').require
const tools = reqlib('./lib/tools.js')
const { v4: uuidv4 } = require('uuid')
var result = ""

function init(API,connections) {

    API.post('/addmodule/', async (req, res) => {
        if (req.body.port && req.body.type) {
            let { err, portconfig, type, connection } = await tools.setport(req.body.type, req.body.port, process.platform, connections)
            if (!err) {
                let DBClient = new (reqlib('./lib/dbclient.js'))(null)
                await DBClient.setport(req.body.type, req.body.port)
                DBClient.closeconnection()
                connections = Object.assign(connections,connection)
            } else {
                res.status(400).send({ error: err })
            }
            res.status(200).json(process.platform)
        } else {
            res.status(400).send({ error: 'missing param' })
        }
    })


    API.get('/modules/', async (req, res) => {
        let modulelist = {}
        if (connections && connections.zwave) {
            modulelist.zwave = connections.zwave
        }
        res.status(200).json(modulelist)
    })

    API.get('/usblist/', async (req, res) => {
        let result = await tools.getusblist()
        res.status(200).json(result)
    })

    

    API.post('/reset/', async (req, res) => {
        connections.zwave.client.softReset()
        res.status(200).send("OK")
    })


}

module.exports = { init }