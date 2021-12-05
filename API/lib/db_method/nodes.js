const { COMCLASS } = require("../classcom");


exports.getnodes = async function () {
    const sql = "SELECT * FROM nodes"
    let result = await this.query(sql)
    return result
}

exports.addvalue = function addvalue(self, valueId, comclass, uid) {
    try {
        let choices = {};
        if (valueId.values) {
            choices = JSON.stringify(Object.assign({}, valueId.values));
        } else {
            choices = "{}";
        }
        let sql = 'INSERT INTO ' + COMCLASS[comclass] +
            ' (nodeuid,valueid,label,value,typevalue,availablevalue)  values ' +
            "('" + uid + "','" + valueId.value_id + "','" + valueId.label + "','" + valueId.value + "','" + valueId.type + "','" + choices + "')" +
            "ON DUPLICATE KEY UPDATE value = '" + valueId.value + "'"
        self.db.query(sql);

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

