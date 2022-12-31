﻿/**
 * 
 * @param {string} name
 */

exports.addroom = async function (name) {
        // don't change databases if room name exist

    let sql = "INSERT INTO rooms (id,name)  values (DEFAULT,$1)" +
        " ON CONFLICT (id,name) DO UPDATE SET name = $1"
    const values = [name]
    await this.query(sql, values)
}

/**
 * 
 * @param {number} id
 */
exports.getroom = async function (id) {

    const sql = "SELECT * from rooms WHERE id=$1"
    const values = [id]
    let result = await this.query(sql,values)
    return result.rows
}

exports.getrooms = async function () {
    const sql = "SELECT * from rooms"
    let result = await this.query(sql)
    return result.rows
}

/**
 * 
 * @param {number} id
 * @param {string} name
 */
exports.updateroom = async function (id, name) {

    const sql = "UPDATE rooms SET name=$1 WHERE id=$2"
    const values =
        [
            name,
            id
        ]
    let result = await this.query(sql.values)
    return result.rows;
}

/**
 * 
 * @param {string} name
 */
exports.removeroom = async function(name) {

    const sql = "DELETE FROM rooms WHERE name = $1";
    const values = [name]
    let result = await this.query(sql,values);
}

