const Express = require('express')
const cors = require('cors')
const reqlib = require('app-root-path').require

function API() {
    if (!(this instanceof API)) {
        return new API()
    }
    init.call(this)
}


function init() { 

    this.api = Express()
    this.api.use(cors())

    this.api.listen(80, () =>
        console.log(`Example app listening on port 80!`),
    )

    this.api.get('/tempstat/',  async (req, res) => {
        let DBClient = new (reqlib('./lib/dbclient.js'))(null)
        let result
        if ('nodeuid' in req.query) {
            result = await DBClient.gettempstat(() => { DBClient.closeconnection() }, req.query)
            res.status(200)
            return res.json(result);
        } else {
            res.status(400).send({ error: 'could interpret param ' + req.query } )
        }
    })

}

module.exports = API