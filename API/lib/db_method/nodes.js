const { COMCLASS } = require("../classcom");


exports.getnodes = async function () {
    const sql = "SELECT * FROM nodes"
    let result = await this.query(sql)
    return result
}

exports.addvalue = function addvalue(value_uid, value, commandClass , commandClassName,type, uid , choices) {
    try {
        let sql = 'INSERT INTO ' + COMCLASS[commandClass] +
            ' (nodeuid,valueid,label,value,typevalue,availablevalue)  values ' +
            "('" + uid +
            "','" + value_uid +
            "','" + commandClassName +
            "','" + value +
            "','" + type +
            "','" + choices + "') " +
            "ON CONFLICT(nodeuid,valueid) DO UPDATE SET " +
            "(label,value,typevalue,availablevalue) = " +
            "(EXCLUDED.label,EXCLUDED.value,EXCLUDED.typevalue,EXCLUDED.availablevalue) "
        console.log(sql)
        this.query(sql);

    } catch (error) {
        console.error(error);
        console.log(comclass);
    }
}

exports.setnoderoom = async function setnoderoom(uid , roomName){
    let sql = ''
    try {
        let name = this.db.escape(roomName)
        sql = 'UPDATE nodes' +
            ' SET roomname = ' + name + 
            " WHERE nodeuid = '" + uid + "'";
        await this.query(sql);
    } catch (error) {
        console.error(error);
        console.log(sql);
    }
}

exports.setnodetype = async function setnodetype(uid , type){
    let sql = ''
    try {
        let name = this.db.escape(type)
        sql = 'UPDATE nodes' +
            " SET type = '" + type.toLowerCase() + "'" + 
            " WHERE nodeuid = '" + uid + "'";
        await this.query(sql);
    } catch (error) {
        console.error(error);
        console.log(sql);
    }
}

exports.addclient = async function addclient(uid, nodeid, name) {
    // don't change databases if node exist
    this.query("INSERT INTO nodes (nodeid,nodeuid,productname)" +
        "values('" + nodeid + "', '" + uid + "', '" + name + "') " +
        "ON CONFLICT(nodeuid) DO UPDATE SET " +
        "(nodeid,nodeuid,productname) = " +
        "(EXCLUDED.nodeid, EXCLUDED.nodeuid, EXCLUDED.productname) ")
}

