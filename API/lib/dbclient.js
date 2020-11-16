/* eslint-disable camelcase */
'use strict'
var mysql = require('mysql');
var reqlib = require('app-root-path').require
const COMCLASS = reqlib('./lib/classcom.js')



function DBClient(zwave) {
    if (!(this instanceof DBClient)) {
        return new DBClient(zwave)
    }
    init.call(this, zwave)
}

function init(zwave) {
    this.zwave = zwave
    this.db = mysql.createPool({
        host: "localhost",
        user: "zwave",
        password: "ppI3h4uwaz*UgT#s",
        database: "homealiveme",
        connectionLimit: 100, 
        multipleStatements: true
    });

    if (zwave) {
        
        var self = this

        createtable(self)

        // add node zwave if exist
        this.zwave.on('node available', function (nodeid, deviceid, name) {
            // add node to the homealiveme db
            addclient(self, deviceid.toString(), nodeid, name)
        })

        this.zwave.on('value added', function (valueId, comclass, deviceid) {
            addvalue(self, valueId, comclass, deviceid)
        })

        this.zwave.on('value changed', function (valueId, comclass, deviceid) {
            addvalue(self, valueId, comclass, deviceid)
        })

        this.zwave.on('scan complete', function () {
            zwave.writeValue({ node_id: 2, class_id: 112, instance: 1, index: 9 }, 20)
        })

    }}

function addclient(self,uid, nodeid, name) {
    // don't change databases if node exist
    self.db.query("INSERT INTO nodes (nodeid,nodeuid,productname)  values ('" + nodeid + "','" + uid + "','" + name + "') ON DUPLICATE KEY UPDATE nodeuid = nodeuid");
}



function createtable(self) {

    console.log('init db conection')
    self.db.query('CREATE TABLE IF NOT EXISTS nodes ' +
        '(nodeid INT NOT NULL,' +
        'nodeuid VARCHAR(32) PRIMARY KEY,' +
        'productname MEDIUMTEXT DEFAULT NULL)')

    Object.keys(COMCLASS).forEach(function (id) {
        self.db.query('CREATE TABLE IF NOT EXISTS ' + COMCLASS[id] + 
            '(nodeuid VARCHAR(32) NOT NULL,' +
            'valueid VARCHAR(32) PRIMARY KEY, ' +
            'label TINYTEXT DEFAULT NULL,' +
            'value TINYTEXT DEFAULT NULL,' +
            'FOREIGN KEY (nodeuid) REFERENCES nodes(nodeuid))')
    })

    self.db.query('CREATE TABLE IF NOT EXISTS Temperature '+
        '(nodeuid VARCHAR(32) NOT NULL,' +
        'label TINYTEXT DEFAULT NULL,' +
        'value TINYTEXT DEFAULT NULL,' +
        'units VARCHAR(32) DEFAULT NULL, ' +
        'date DATETIME DEFAULT NULL, ' +
        'FOREIGN KEY (nodeuid) REFERENCES nodes(nodeuid))')

    self.db.query('CREATE TABLE IF NOT EXISTS Lux ' +
        '(nodeuid VARCHAR(32) NOT NULL,' +
        'label TINYTEXT DEFAULT NULL,' +
        'value TINYTEXT DEFAULT NULL,' +
        'units VARCHAR(32) DEFAULT NULL, ' +
        'date DATETIME DEFAULT NULL, ' +
        'FOREIGN KEY (nodeuid) REFERENCES nodes(nodeuid))')   

}

function addvalue(self, valueId, comclass, uid) {
    try {
        self.db.query('INSERT INTO ' + COMCLASS[comclass] +
            ' (nodeuid,valueid,label,value)  values ' +
            "('" + uid + "','" + valueId.value_id + "','" + valueId.label + "','" + valueId.value + "')" +
            "ON DUPLICATE KEY UPDATE value = '" + valueId.value + "'")

    } catch (error) {
        console.error(error);
        console.log(comclass);
    }
}

DBClient.prototype.addtemplog = async function (_callback) {
    const db = this.db
    var now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sql = 'SELECT *  FROM ' + COMCLASS[49] + " WHERE label LIKE 'Air Temperature%' ORDER BY nodeuid, label"
    var data = {}
    var struct = {}
    var sql_push

    db.query(sql, function (err, result, fields) {
        if (err) throw err;
        for (var i of result) {
            var row = Object.assign({}, i)
            console.log(row)
            struct[row.label] = row.value
            data[row.nodeuid] = struct
        }

        var promises = []
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

DBClient.prototype.closeconnection = function () {
    console.log('close db')
    this.db.end()
}


module.exports = DBClient