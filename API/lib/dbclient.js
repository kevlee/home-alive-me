/* eslint-disable camelcase */
'use strict'

var mysql = require('pg')
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
    this.db = new mysql.Pool({
        host: process.env.APP_MYSQL_HOST || "localhost",
        user: process.env.SQL_USER || "zwave",
        password: process.env.SQL_PASSWORD || "ppI3h4uwaz*UgT#s",
        database: process.env.SQL_DATABASE || "homealiveme",
        port: 5432,
        connectionLimit: 100, 
        multipleStatements: true
    });

    this.query = util.promisify(this.db.query).bind(this.db);


    if (master) {
        
        var self = this

        await createtable(self)

        // add node zwave if exist
        emitters.zwave.on('node available', function (nodeid, nodeuid, productType) {
            // add node to the homealiveme db
            self.addclient(nodeuid, nodeid, productType)
           
        })

        emitters.zwave.on('value added', function (value_uid, valueId, value, nodeid, deviceid) {
            self.addvalue(value_uid, value, valueId.commandClass,
                valueId.label, valueId.type, deviceid, JSON.stringify(valueId.availablevalue))
        })

        emitters.zwave.on('value changed', function (value_uid,valueId, value, nodeid, deviceid) {
            self.addvalue(value_uid, value, valueId.commandClass,
                valueId.label, valueId.type, deviceid, JSON.stringify(valueId.availablevalue))
        })
        
        
        emitters.zwave.on('node ready', function (ozwnode) {
            console.log("insert into DB node", ozwnode.id)
            //if (!ozwnode.isController) {
            //    self.addclient(self, nodeuid.toString(), nodeid, name, devicetype)
            //}
            //if (self.addedclient == true) {
            //    updatetaskstatus(self, 'AddDevice', 'Completed', { 'node_uid': ozwnode.id + "-" + ozwnode.name })
            //    self.addedclient = false
            //}
        })

        emitters.zwave.on('negociate node', function (obj) {
            manageControllerSyncStatus(self,obj)
        })

    }}




function createtable(self) {

    Object.keys(COMCLASS).forEach(function (id) {
        self.db.query('CREATE TABLE IF NOT EXISTS ' + COMCLASS[id] +
            '(nodeuid VARCHAR(60) NOT NULL,' +
            'valueid VARCHAR(60) NOT NULL,' +
            'label TEXT DEFAULT NULL,' +
            'value TEXT DEFAULT NULL,' +
            'typevalue TEXT DEFAULT NULL,' +
            'availablevalue JSON DEFAULT NULL,' +
            'PRIMARY KEY (nodeuid,valueid), ' +
            'FOREIGN KEY (nodeuid) REFERENCES nodes(nodeuid) ON DELETE CASCADE)')
    })

}

function manageControllerSyncStatus(self, obj) {
    switch (true) {
        case obj.type.includes('Inclusion'):
            switch (true) {
                case obj.status.includes('Canceled'):
                    updatetaskstatus(self, 'AddDevice', 'Canceled')
                    break
                case obj.status.includes('Failed'):
                    updatetaskstatus(self, 'AddDevice', 'Failed')
                    break
                case obj.status.includes('Completed'):
                    if (obj.nodeId > 1 && obj.nodeId < 255) {
                        updatetaskstatus(self, 'AddDevice', 'Completed')
                        this.addedclient = true
                    }
                    break
                default:
            }
            break
        case obj.type.includes('Exlusion'):
            switch (true) {
                case obj.status.includes('Canceled'):
                    updatetaskstatus(self, 'RemoveDevice', 'Canceled')
                    break
                case obj.status.includes('Failed'):
                    updatetaskstatus(self, 'RemoveDevice', 'Failed')
                    break
                case obj.status.includes('Completed'):
                    if (obj.nodeId > 1 && obj.nodeId < 255) {
                        updatetaskstatus(self, 'RemoveDevice', 'Completed')
                        removeclient(self, obj.nodeId)
                    }
                    break
                default:
            }
            break
        default:
            console.log('not device added notification ')
    }
}

function updatetaskstatus(self, type, status, result=null) {
    let sql = "UPDATE task SET status = '" +
        status + "' WHERE taskname = '" + type + "'"
    if (result) {
        sql = "UPDATE task SET status = '" + status +
            "', result = '" + JSON.stringify(result) +
            "' WHERE taskname = '" + type + "'"
    }
    this.query(sql)
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
DBClient.prototype.addvalue = nodes.addvalue
DBClient.prototype.addclient = nodes.addclient

DBClient.prototype.addtemplog = async function (_callback) {
    let db = this.db
    let now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let sql = 'SELECT *  FROM ' + COMCLASS[49] + " WHERE label LIKE 'Air Temperature%' ORDER BY nodeuid, label"
    let data = {}
    let struct = {}
    let sql_push

    let result = await this.query(sql)
    for (var i of result.rows) {
        var row = Object.assign({}, i)
        struct[row.label] = row.value
        data[row.nodeuid] = struct
    }

    let promises = []
    for (const [key, value] of Object.entries(data)) {
        sql_push = 'INSERT INTO Temperature (nodeuid,value,units,date) values ' +
                "('" + key + "','" + value['Air Temperature'] + "','" +
                value['Air Temperature Units'] + "','" + now + "')"
        await this.query(sql_push)
                                 
    }
}

DBClient.prototype.gettempstat = async function (_callback,param) {
    let db = this.db
    let id = db.escape(param.nodeuid)
    let sql
    let sql_result = {}
    
    if (!id)
        sql = 'SELECT *  FROM Temperature'
    else
        sql = 'SELECT *  FROM Temperature WHERE nodeuid =' + id

    let result = await this.query(sql)
    for (var i of result.rows) {
        sql_result = Object.assign({}, i)
        struct.push({
            value: row.value, units: row.units, date: row.date
        })
        sql_result[row.nodeuid] = struct
    }
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
    let sql = {}
    sql.text = "SELECT * FROM " + COMCLASS[38] + " WHERE nodeuid = $1 and label='Current value'"
    sql.values = [uuid]
    let result = await this.query(sql)
    _callback()
    return result.rows[0]

}

DBClient.prototype.getnodeconfig = async function (_callback, uuid) {

    const sql = 'SELECT * FROM ' + COMCLASS[112] + ' WHERE nodeuid = $1'
    let result = await this.query(sql, [uuid])
    _callback()
    //for (var row in result.rows) {
    //result.rows[row].availablevalue = JSON.parse(result.rows[row].availablevalue)
    //}
    return result.rows

}

DBClient.prototype.setport = async function (type,port) {
    const sql = "INSERT INTO connection (type,port) values ('" + type + "','" + port +
        "') ON CONFLICT(type) DO UPDATE SET port = EXCLUDED.port"
    let result = await this.query(sql)
    return result.rows

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
    return result.rows

}


DBClient.prototype.closeconnection = function () {
    this.db.end()
}


module.exports = DBClient