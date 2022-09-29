'use strict'
const reqlib = require('app-root-path').require
const tools = reqlib('./lib/tools.js')
const { v4: uuidv4 } = require('uuid')
var result = ""
const flatted = require('flatted')

function init(API) {

    API.post('/addmodule/', async (req, res) => {
        if (req.body.port && req.body.type) {
            let { err, portconfig, type, connection } = await tools.setport(req.body.type, req.body.port, process.platform, global.connections)
            if (!err) {
                let DBClient = new (reqlib('./lib/dbclient.js'))(null)
                await DBClient.setport(req.body.type, req.body.port)
                DBClient.closeconnection()
                console.log(global.connections)
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
        if (global.connections && global.connections.zwave) {
            modulelist = global.connections
        }
        res.status(200).send(modulelist)
    })

    API.get('/usblist/', async (req, res) => {
        let result = await tools.getusblist()
        res.status(200).json(result)
    })

    

    API.post('/reset/', async (req, res) => {
        global.connections.zwave.client.softReset()
        res.status(200).send("OK")
    })


}

module.exports = { init }