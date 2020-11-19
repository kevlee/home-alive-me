var Express = require('express')
var cors = require('cors')
var reqlib = require('app-root-path').require

function API() {
    if (!(this instanceof API)) {
        return new API()
    }
    init.call(this)
}


function init() { 

    this.api = Express()

    this.api.listen(80, () =>
        console.log(`Example app listening on port 80!`),
    )

    this.api.get('/tempstat/', cors(),  async (req, res) => {
        let DBClient = new (reqlib('./lib/dbclient.js'))(null)
        let result
        if ('nodeuid' in req.query) {
            result = await DBClient.gettempstat(() => { DBClient.closeconnection() }, req.query)
            res.status(200)
            return res.send({ result });
        } else {
            res.status(400).send({ error: 'could interpret param ' + req.query } )
        }
    })

}

module.exports = API