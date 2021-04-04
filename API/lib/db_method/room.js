/**
 * 
 * @param {string} name
 */

exports.addroom = async function (name) {
        // don't change databases if room name exist
        let db = this.db
        let roomname = db.escape(name)
        let sql = "INSERT INTO rooms (name)  values (" + roomname +
            ") ON DUPLICATE KEY UPDATE name = " + roomname
        await this.query(sql);
}

/**
 * 
 * @param {number} id
 */
exports.getroom = async function (id) {
    let db = this.db
    let id_room = db.escape(id)
    let sql = "SELECT * from rooms WHERE id=" + id_room
    let result = await this.query(sql)
    return result;
}

exports.getrooms = async function () {
    let sql = "SELECT * from rooms"
    let result = await this.query(sql)
    return result;
}

/**
 * 
 * @param {number} id
 * @param {string} name
 */
exports.updateroom = async function (id, name) {
    let db = this.db
    let id_room = db.escape(id)
    let roomname = db.escape(name)
    let sql = "UPDATE rooms SET name=" + roomname + " WHERE id=" + id_room
    let result = await this.query(sql)
    return result;
}

/**
 * 
 * @param {string} name
 */
exports.removeroom = async function(name) {
    let db = this.db;
    let id = db.escape(name);
    const sql = "DELETE FROM rooms WHERE name = " + "'" + name + "'";
    let result = await this.query(sql);
}

