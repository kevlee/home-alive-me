
exports.addroom = async function (name) {
        // don't change databases if room name exist
        let db = this.db
        let roomname = db.escape(name)
        let sql = "INSERT INTO rooms (name)  values (" + roomname +
            ") ON DUPLICATE KEY UPDATE name = " + roomname
        await this.query(sql);
    }

exports.getrooms = async function () {
    let sql = "SELECT * from rooms"
    let result = await this.query(sql)
    return result;
}

//DBClient.prototype.removeroom = async function(name) {
//    let db = this.db;
//    let id = db.escape(name);
//    const sql = "DELETE FROM rooms WHERE name = " + "'" + name + "'";
//    let result = await this.query(sql);
//};

