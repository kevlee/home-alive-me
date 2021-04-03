/** Add zwave client
 *
 * @param {DBClient} self
 * @param {string} uid
 * @param {number} nodeid
 * @param {string} name
 * @param {string} type
 */
function addclient(self, uid, nodeid, name, type) {
    // don't change databases if node exist
    let sql = "INSERT INTO nodes (nodeid,nodeuid,productname,type)  values ('"
        + nodeid + "','" + nodeid + "-" + uid + "','" + name + "','" + type +
        "') ON DUPLICATE KEY UPDATE nodeuid = nodeuid ";
    self.db.query(sql);
}
exports.addclient = addclient;
/** Remove zwave client
 *
 * @param {DBClient} self
 * @param {number} nodeid
 */
function removeclient(self, nodeid) {
    const sql = "DELETE FROM nodes WHERE nodeid = '" + nodeid + "'";
    self.db.query(sql);
}
exports.removeclient = removeclient;
