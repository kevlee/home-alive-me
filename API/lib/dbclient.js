/* eslint-disable camelcase */
'use strict'
var mysql = require('mysql');
const util = require('util');
var reqlib = require('app-root-path').require
const COMCLASS = reqlib('./lib/classcom.js')



function DBClient(zwave) {
    if (!(this instanceof DBClient)) {
        return new DBClient(zwave)
    }
    init.call(this, zwave)
}

async function init(zwave) {
    this.addedclient = false
    this.zwave = zwave
    this.db = mysql.createPool({
        host: "localhost",
        user: "zwave",
        password: "ppI3h4uwaz*UgT#s",
        database: "homealiveme",
        connectionLimit: 100, 
        multipleStatements: true
    });

    this.query = util.promisify(this.db.query).bind(this.db);


    if (zwave) {
        
        var self = this

        await createtable(self)

        // add node zwave if exist
        this.zwave.on('node available', function (nodeid, deviceid, name) {
            // add node to the homealiveme db
            addclient(self, deviceid.toString(), nodeid, name, devicetype)
        })

        this.zwave.on('value added', function (valueId, comclass, nodeid, deviceid) {
            
        })

        this.zwave.on('value changed', function (valueId, comclass, nodeid, deviceid) {
            addvalue(self, valueId, comclass, nodeid + "-" + deviceid)
        })

        this.zwave.on('scan complete', function () {
            zwave.client.requestAllConfigParams(8)
            zwave.client.requestAllConfigParams(7)
            zwave.client.requestAllConfigParams(4)
        })

        this.zwave.on('node ready', function (ozwnode) {
            for (let [key, value] of Object.entries(ozwnode.values)) {
                addvalue(self, value, value.class_id, ozwnode.node_id + "-" + ozwnode.device_id)
            }
            if (self.addedclient == true) {
                updatetaskstatus(self, 'AddDevice', 'Completed', { 'node_uid': ozwnode.node_id + "-" + ozwnode.device_id })
                self.addedclient = false
            }
        })
        
        this.zwave.on('command controller', (obj) => {
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

    self.db.query('CREATE TABLE IF NOT EXISTS nodes ' +
        '(nodeid INT NOT NULL,' +
        'nodeuid VARCHAR(32) PRIMARY KEY,' +
        'productname MEDIUMTEXT DEFAULT NULL,'+
        'type TINYTEXT DEFAULT NULL)')

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

    self.db.query('CREATE TABLE IF NOT EXISTS Temperature ' +
        '(nodeuid VARCHAR(32) NOT NULL,' +
        'label TINYTEXT DEFAULT NULL,' +
        'value TINYTEXT DEFAULT NULL,' +
        'units VARCHAR(32) DEFAULT NULL, ' +
        'date DATETIME DEFAULT NULL, ' +
        'FOREIGN KEY (nodeuid) REFERENCES nodes(nodeuid) ON DELETE CASCADE)')


    self.db.query('CREATE TABLE IF NOT EXISTS Lux ' +
        '(nodeuid VARCHAR(32) NOT NULL,' +
        'label TINYTEXT DEFAULT NULL,' +
        'value TINYTEXT DEFAULT NULL,' +
        'units VARCHAR(32) DEFAULT NULL, ' +
        'date DATETIME DEFAULT NULL, ' +
        'FOREIGN KEY (nodeuid) REFERENCES nodes(nodeuid) ON DELETE CASCADE)')

    self.db.query('CREATE TABLE IF NOT EXISTS Task ' +
        '(id VARCHAR(36) PRIMARY KEY,' +
        "taskname VARCHAR(36) DEFAULT NULL," +
        "status TINYTEXT," +
        'result JSON,' +
        'date DATETIME DEFAULT NULL )')

    //self.db.query('TRUNCATE task');

}

function addclient(self,uid, nodeid, name, type) {
    // don't change databases if node exist
    let sql = "INSERT INTO nodes (nodeid,nodeuid,productname,type)  values ('"
        + nodeid + "','" + nodeid + "-" + uid + "','" + name + "','" + type +
        "') ON DUPLICATE KEY UPDATE nodeuid = nodeuid "
    self.db.query(sql);
}

function removeclient(self, nodeid) {
    const sql = "DELETE FROM nodes WHERE nodeid = '" + nodeid + "'"
    self.db.query(sql)  
}



function addvalue(self, valueId, comclass, uid) {
    try {
        let choices = {}
        if (valueId.values) {
            choices = JSON.stringify(Object.assign({}, valueId.values))
        } else {
            choices = "{}"
        }
        let sql = 'INSERT INTO ' + COMCLASS[comclass] +
            ' (nodeuid,valueid,label,value,typevalue,availablevalue)  values ' +
            "('" + uid + "','" + valueId.value_id + "','" + valueId.label + "','" + valueId.value + "','" + valueId.type + "','" + choices + "')" +
            "ON DUPLICATE KEY UPDATE value = '" + valueId.value + "'"
        self.db.query(sql)

    } catch (error) {
        console.error(error);
        console.log(comclass);
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
    self.db.query(sql)
}

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
            console.log(sql_push)
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
            for (var i of result) {
                var row = Object.assign({}, i)
                struct.push({
                    value: row.value, units: row.units, date: row.date
                })
                data[row.nodeuid] = struct
            }
            resolve(data)
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
    console.log(global.devicetype)
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

DBClient.prototype.getnodes = async function (_callback, uuid) {
    const sql = "SELECT * FROM nodes"
    let result = await this.query(sql)
    _callback()
    return result

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


DBClient.prototype.closeconnection = function () {
    this.db.end()
}


module.exports = DBClient