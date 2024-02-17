const { COMCLASS } = require("../classcom");


exports.getnodes = async function () {
    const sql = "SELECT * FROM nodes"
    let result = await this.query(sql)
    return result.rows
}

exports.addvalue = function addvalue(value_uid, value, commandClass , commandClassName,type, uid , choices) {
    try {
        
        const sql = "INSERT INTO " + COMCLASS[commandClass] +
            " (nodeuid,valueid,label,value,typevalue,availablevalue) values" +
            " ($1,$2,$3,$4,$5,$6)" +
            " ON CONFLICT(nodeuid,valueid) DO UPDATE SET" +
            " (label,value,typevalue,availablevalue) =" +
            " (EXCLUDED.label,EXCLUDED.value,EXCLUDED.typevalue,EXCLUDED.availablevalue) "
        const values =
            [
                uid,
                value_uid,
                commandClassName,
                value,
                type,
                choices,
            ]
        this.query(sql,values)

    } catch (error) {
        console.error(error)
        console.log(comclass)
    }
}

exports.setnoderoom = async function setnoderoom(uid , roomName){
    try {
        
        const sql = "UPDATE nodes" +
            " SET roomname = $1" +
            " WHERE nodeuid = $2"
        const values =
            [
                roomName,
                uid
            ]
        await this.query(sql,values)
    } catch (error) {
        console.error(error)
        console.log(sql)
    }
}

exports.setnodetype = async function setnodetype(uid , type){
    let sql = ''
    try {
        sql = 'UPDATE nodes' +
            " SET type = $1" + 
            " WHERE nodeuid = $2"
        const values = [type.toLowerCase(), uid]
        await this.query(sql,values)
    } catch (error) {
        console.error(error)
        console.log(sql)
    }
}

exports.addclient = async function addclient(uid, nodeid, name) {
    // don't change databases if node exist
    try {
        const sql =
            "INSERT INTO nodes (nodeuid,productname, connection)" +
            "values($1, $2, $3) " +
            "ON CONFLICT(nodeuid) DO UPDATE SET " +
            "(nodeuid,productname,connection) = " +
            "(EXCLUDED.nodeuid, EXCLUDED.productname, EXCLUDED.connection) "
        const values =
            [
                uid,
                name,
                "zwave"
            ]
        this.query(sql,values)
        
    } catch (error) {
        console.error(error)
        console.log(sql)
    }
    
}

exports.addzigbeenode = async function addzigbeenode(zbnode) {
    // don't change databases if node exist
    console.log("add node to db")
    try {
        const sql =
            "INSERT INTO nodes (nodeuid,productname,connection)" +
            "values($1, $2, $3) " +
            "ON CONFLICT(nodeuid) DO UPDATE SET " +
            "(nodeuid,productname,connection) = " +
            "(EXCLUDED.nodeuid, EXCLUDED.productname, EXCLUDED.connection) "
        const values =
            [
                zbnode.id + '-' + zbnode.manufId + '-' + zbnode.nwkAddr,
                zbnode.manufName,
                "zigbee"
            ]
        this.query(sql, values)

    } catch (error) {
        console.error(error)
        console.log(sql)
    }

}

