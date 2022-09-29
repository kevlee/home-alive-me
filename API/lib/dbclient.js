/* eslint-disable camelcase */
'use strict'

var mysql = require('mysql')
const util = require('util')
const { addclient, removeclient } = require("./db_method/zwavenode")
var reqlib = require('app-root-path').require
const { COMCLASS } = require("./classcom")
var emitters = reqlib('./lib/globalemitters')
const room = require("./db_method/room")
const nodes = require("./db_method/nodes")


function DBClient(master) {
    if (!(this instanceof DBClient)) {
        return new DBClient(master)
    }
    init.call(this, master)
}


async function init(master) {
    this.addedclient = false
    this.db = mysql.createPool({
        host: process.env.APP_MYSQL_HOST || "localhost",
        user: process.env.MYSQL_USER || "zwave",
        password: process.env.MYSQL_PASSWORD || "ppI3h4uwaz*UgT#s",
        database: process.env.MYSQL_DATABASE || "homealiveme",
        port: 3306,
        connectionLimit: 100, 
        multipleStatements: true
    });

    this.query = util.promisify(this.db.query).bind(this.db);


    if (master) {
        
        var self = this

        await createtable(self)

        // add node zwave if exist
        emitters.zwave.on('node available', function (nodeid, deviceid, name) {
            // add node to the homealiveme db
            if (name != "" && devicetype != "") {
                addclient(self, deviceid.toString(), nodeid, name, devicetype)
            }
        })

        emitters.zwave.on('value added', function (valueId, comclass, nodeid, deviceid) {
            nodes.addvalue(self, valueId, comclass, nodeid + "-" + deviceid)
        })

        emitters.zwave.on('value changed', function (valueId, comclass, nodeid, deviceid) {
            nodes.addvalue(self, valueId, comclass, nodeid + "-" + deviceid)
        })
        

        emitters.zwave.on('node ready', function (ozwnode) {
            for (let [key, value] of Object.entries(ozwnode.values)) {
                nodes.addvalue(self, value, value.class_id, ozwnode.node_id + "-" + ozwnode.device_id)
            }
            if (self.addedclient == true) {
                updatetaskstatus(self, 'AddDevice', 'Completed', { 'node_uid': ozwnode.node_id + "-" + ozwnode.device_id })
                self.addedclient = false
            }
        })

        emitters.zwave.on('command controller', (obj) => {
            switch (true) {
                case obj.help.includes('AddDevice'):
                    switch (true) {
                        case obj.help.includes('Canceled'):
                            updatetaskstatus(self,'AddDevice','Canceled')
                            break
                        case obj.help.includes('Failed'):
                            updatetaskstatus(self,'AddDevice', 'Failed')
                            break
                        case obj.help.includes('Completed'):
                            if (obj.nodeid > 1 && obj.nodeid < 255) {
                                updatetaskstatus(self, 'AddDevice', 'Completed')
                                this.addedclient = true
                            }
                            break
                        default:
                    }
                    break
                case obj.help.includes('RemoveDevice'):
                    switch (true) {
                        case obj.help.includes('Canceled'):
                            updatetaskstatus(self, 'RemoveDevice', 'Canceled')
                            break
                        case obj.help.includes('Failed'):
                            updatetaskstatus(self, 'RemoveDevice', 'Failed')
                            break
                        case obj.help.includes('Completed'):
                            if (obj.nodeid > 1 && obj.nodeid < 255) {
                                updatetaskstatus(self, 'RemoveDevice', 'Completed')
                                removeclient(self,obj.nodeid)
                            }
                            break
                        default:
                    }
                    break
                default:
                    console.log('not device added notification ' + obj.help)
            }
        })

    }}


function createtable(self) {

    Object.keys(COMCLASS).forEach(function (id) {
        self.db.query('CREATE TABLE IF NOT EXISTS ' + COMCLASS[id] +
            '(nodeuid VARCHAR(32) NOT NULL,' +
            'valueid VARCHAR(32) PRIMARY KEY, ' +
            'label TINYTEXT DEFAULT NULL,' +
            'value TINYTEXT DEFAULT NULL,' +
            'typevalue TINYTEXT DEFAULT NULL,' +
            'availablevalue JSON DEFAULT NULL,' +
            'FOREIGN KEY (nodeuid) REFERENCES nodes(nodeuid) ON DELETE CASCADE)')

    })

}

function updatetaskstatus(self, type, status, result=null) {
    let sql = "UPDATE task SET status = '" +
        status + "' WHERE taskname = '" + type + "'"
    if (result) {
        sql = "UPDATE task SET status = '" + status +
            "', result = '" + JSON.stringify(result) +
            "' WHERE taskname = '" + type + "'"
    }
    self.db.query(sql)
}

/***************** ROOM MANAGEMENT *******************/

DBClient.prototype.addroom = room.addroom
DBClient.prototype.getroom = room.getroom
DBClient.prototype.getrooms = room.getrooms
DBClient.prototype.updateroom = room.updateroom
DBClient.prototype.removeroom = room.removeroom


/***************** NODES MANAGEMENT *******************/

DBClient.prototype.getnodes = nodes.getnodes
DBClient.prototype.setnoderoom = nodes.setnoderoom
DBClient.prototype.setnodetype = nodes.setnodetype

DBClient.prototype.addtemplog = async function (_callback) {
    let db = this.db
    let now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let sql = 'SELECT *  FROM ' + COMCLASS[49] + " WHERE label LIKE 'Air Temperature%' ORDER BY nodeuid, label"
    let data = {}
    let struct = {}
    let sql_push

    db.query(sql, function (err, result, fields) {
        if (err) throw err;
        for (var i of result) {
            var row = Object.assign({}, i)
            struct[row.label] = row.value
            data[row.nodeuid] = struct
        }

        let promises = []
        for (const [key, value] of Object.entries(data)) {
            sql_push = 'INSERT INTO Temperature (nodeuid,value,units,date) values ' +
                "('" + key + "','" + value['Air Temperature'] + "','" +
                value['Air Temperature Units'] + "','" + now + "')"
            promises.push(new Promise((resolve) => {
                db.query(sql_push, function () { resolve('finish') })
            }))
                                 
        }
        Promise.all(promises).then(() => {
            _callback()
        })

    })

}

DBClient.prototype.gettempstat = async function (_callback,param) {
    let db = this.db
    let id = db.escape(param.nodeuid)
    let sql
    var sql_result
    
    if (!id)
        sql = 'SELECT *  FROM Temperature'
    else
        sql = 'SELECT *  FROM Temperature WHERE nodeuid =' + id


    let promise = new Promise((resolve) => {
        db.query(sql, function (err, result, fields) {
            let data = {}
            let struct = []
            if (result) {
                for (var i of result) {
                    var row = Object.assign({}, i)
                    struct.push({
                        value: row.value, units: row.units, date: row.date
                    })
                    data[row.nodeuid] = struct
                }
                resolve(data)
            } else {
                resolve([])
            }
        })
    })

    promise.then((result) => {
        _callback()
        sql_result = result
    })
    await promise
    return sql_result
}

DBClient.prototype.inittask = async function (_callback,uuid,type) {
    let db = this.db
    let now = new Date().toISOString().slice(0, 19).replace('T', ' ')
    let sql = "INSERT INTO task (id,taskname,status,result,date) values " +
        "('" + uuid + "','" + type + "','processing','{}','" + now + "')"
    await db.query(sql)
}

DBClient.prototype.gettaskstatus = async function (_callback, uuid) {
    let db = this.db
    let id = db.escape(uuid)
    const sql = "SELECT * FROM task WHERE id =" + id 
    let result = await this.query(sql)
    _callback()
    result[0].result = JSON.parse(result[0].result)
    return result[0]

}

DBClient.prototype.removetask = async function (_callback, uuid) {
    let db = this.db
    let id = db.escape(uuid)
    const sql = "DELETE FROM task WHERE id =" + id
    let result = await this.query(sql)

}



DBClient.prototype.getcurtainlevel = async function (_callback, uuid) {
    let db = this.db
    let id = db.escape(uuid)
    const sql = "SELECT * FROM " + COMCLASS[38] + " WHERE nodeuid =" + id +
        " and label='level'"
    let result = await this.query(sql)
    _callback()
    return result[0]

}

DBClient.prototype.getnodeconfig = async function (_callback, uuid) {
    let db = this.db
    let id = db.escape(uuid)
    const sql = "SELECT * FROM " + COMCLASS[112] + " WHERE nodeuid =" + id
    let result = await this.query(sql)
    _callback()
    for (var row in result) {
        result[row].availablevalue = JSON.parse(result[row].availablevalue)
    }
    return result

}

DBClient.prototype.setport = async function (type,port) {
    const sql = "INSERT INTO connection (type,port) values ('" + type + "','" + port +
        "') ON DUPLICATE KEY UPDATE port = '" + port + "'"
    let result = await this.query(sql)
    return result

}

DBClient.prototype.getmodulesconfigs = async function () {
    const sql = "SELECT * FROM connection"
    let result 
    try {
        result = await this.query(sql)
    } catch (error) {
        console.log(error)
        return []
    }
    return result

}


DBClient.prototype.closeconnection = function () {
    this.db.end()
}


module.exports = DBClient