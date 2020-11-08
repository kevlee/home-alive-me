/* eslint-disable camelcase */
'use strict'
var mysql = require('mysql');


class DBClient {
    constructor(){
        this.db = mysql.createConnection({
            host: "localhost",
            user: "zwave",
            password: "ppI3h4uwaz*UgT#s",
            database: "homealiveme"
        });
        console.log('init db conection')
    }
    addclient(uid, nodeid) {
        // don't change databases if node exist
        this.db.query("INSERT INTO nodes (nodehexcode,nodeid)  values ('" + uid + "','" + nodeid + "') ON DUPLICATE KEY UPDATE nodehexcode = nodehexcode");
    }
}

module.exports = DBClient