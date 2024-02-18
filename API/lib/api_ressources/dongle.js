'use strict'
const reqlib = require('app-root-path').require
const tools = reqlib('./lib/tools.js')
const { v4: uuidv4 } = require('uuid')
var result = ""
const { parse, stringify, toJSON, fromJSON } = require('flatted')
const { json } = require("json")

function init(API) {

    API.post('/addmodule/', async (req, res) => {
        try {
            if (req.body.port && req.body.type) {
                console.log(req.body)
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
        } catch (error) {
            res.status(400).send({ error: error })
        }
    })


    API.get('/modules/', async (req, res) => {
        let modulelist = {}
        if (global.connections && global.connections.zwave) {
            modulelist = JSON.stringify(global.connections.zwave.cfg)
        }
        if (global.connections && global.connections.zigbee) {
            modulelist = JSON.stringify(global.connections.zigbee.cfg)
        }
        
        res.status(200).setHeader('Content-Type', 'application/json').send(modulelist)
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