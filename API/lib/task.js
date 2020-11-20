/* eslint-disable camelcase */
'use strict'
var reqlib = require('app-root-path').require
    

const minutes = 60;
const interval = minutes * 60 * 1000;

function Task() {
    if (!(this instanceof Task)) {
        return new Task()
    }
    init.call(this)
}

function init() {
    logtemp()
    setInterval(() => logtemp(), interval)
}

async function logtemp() {
    var DBClient = new (reqlib('./lib/dbclient.js'))(null)

    DBClient.addtemplog(() => { DBClient.closeconnection() })
}

module.exports = Task