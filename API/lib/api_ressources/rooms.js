'use strict'
const reqlib = require('app-root-path').require
var result=""

function init(API) {
    API.get('/room/', async (req, res) => {
        try {
            let DBClient = new (reqlib('./lib/dbclient.js'))(null)
            result = await DBClient.getrooms(req.body.name)
            DBClient.closeconnection()
            res.status(200).send(result)
        }
        catch (e) {
            res.status(400).send({ error: e.message })
        }
    })

    API.post('/room/', async (req, res) => {
        try {
            if (req.body.name) {
                let DBClient = new (reqlib('./lib/dbclient.js'))(null)
                await DBClient.addroom(req.body.name)
                DBClient.closeconnection()
                res.status(200).send()
            } else {
                res.status(400).send({ error: 'no name in query' })
            }
        }
        catch (e) {
            res.status(400).send({ error: e.message })
        }
    })

    API.put('/room/:id', async (req, res) => {
        try {
            if (req.body.name) {
                let DBClient = new (reqlib('./lib/dbclient.js'))(null)
                await DBClient.addroom(req.body.name)
                DBClient.closeconnection()
                res.status(200).send()
            } else {
                res.status(400).send({ error: 'no name in query' })
            }
        }
        catch (e) {
            res.status(400).send({ error: e.message })
        }
    })

    API.delete('/room/', async (req, res) => {
        if (req.body.name) {
            let DBClient = new (reqlib('./lib/dbclient.js'))(null)
            result = await DBClient.removeroom(req.body.name)
            DBClient.closeconnection()
            res.status(200).send()
        } else {
            res.status(400).send({ error: 'no name in query' })
        }

    })


}

module.exports = { init }