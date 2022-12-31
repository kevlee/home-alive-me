/** Add zwave client
 *
 * @param {DBClient} self
 * @param {string} uid
 * @param {number} nodeid
 * @param {string} name
 * @param {string} type
 */
function addclient(uid, nodeid, name, type) {
    // don't change databases if node exist
    let sql = "INSERT INTO nodes (nodeid,nodeuid,productname,type)  values ('"
        + nodeid + "','" + nodeid + "-" + uid + "','" + name + "','" + type +
        "') ON DUPLICATE KEY UPDATE nodeuid = nodeuid ";
    this.query(sql);
}
exports.addclient = addclient;
/** Remove zwave client
 *
 * @param {number} nodeid
 */
function removeclient( nodeid) {
    const sql = "DELETE FROM nodes WHERE nodeid = '" + nodeid + "'";
    this.query(sql);
}
exports.removeclient = removeclient;
