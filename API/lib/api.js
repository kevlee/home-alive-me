const Express = require('express')
const cors = require('cors')
const reqlib = require('app-root-path').require
const bodyParser = require('body-parser')
const tools = reqlib('./lib/tools.js')
const rooms = reqlib('./lib/api_ressources/rooms.js')
const dongle = reqlib('./lib/api_ressources/dongle.js')
const nodes = reqlib('./lib/api_ressources/nodes.js')


global.devicetype = null

function API() {
    if (!(this instanceof API)) {
        return new API()
    }
    init.call(this)
}


function init() {

    this.connections = {},
    this.api = Express()
    this.api.use(cors())
    this.api.use(bodyParser.urlencoded({ extended: true }))
    this.api.use(bodyParser.json())
    this.api.use(bodyParser.raw())


    this.api.listen(80, () =>
        console.log(`Example app listening on port 80!`),
    )

    this.api.get('/tempstat/', async (req, res) => {
        let DBClient = new (reqlib('./lib/dbclient.js'))(null)
        let result
        if ('nodeuid' in req.query) {
            result = await DBClient.gettempstat(() => { DBClient.closeconnection() }, req.query)
            res.status(200)
            return res.json(result);
        } else {
            res.status(400).send({ error: 'could interpret param ' + req.query })
        }
    })

    rooms.init(this.api)

    dongle.init(this.api,this.connections)

    nodes.init(this.api,this.connections)

    this.api.get('/task/:uuid', async (req, res) => {
        if (req.params.uuid) {
            let DBClient = new (reqlib('./lib/dbclient.js'))(null)
            result = await DBClient.gettaskstatus(() => { DBClient.closeconnection() }, req.params.uuid)
            res.status(200).json(result)
        } else {
            res.status(400).send({ error: 'no uuid in query' })
        }
         
    })

    this.api.delete('/task/:uuid', async (req, res) => {
        if (req.params.uuid) {
            let DBClient = new (reqlib('./lib/dbclient.js'))(null)
            result = await DBClient.removetask(() => { DBClient.closeconnection() }, req.params.uuid)
            res.status(200)
        } else {
            res.status(400).send({ error: 'no uuid in query' })
        }

    })



}

module.exports = API