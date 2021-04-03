const { COMCLASS } = require("../classcom");

function addvalue(self, valueId, comclass, uid) {
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
            "ON DUPLICATE KEY UPDATE value = '" + valueId.value + "'";
        self.db.query(sql);

    } catch (error) {
        console.error(error);
        console.log(comclass);
    }
}
exports.addvalue = addvalue;
