const dal = require("../dal/dal");

async function getAllUsers() {
    const sql = `SELECT * FROM users`;
    const info = await dal.execute(sql);
    return info;
}

async function getUser(id) {
    const sql = `SELECT * FROM users WHERE userID = ${id}`;
    const info = await dal.execute(sql);
    return info[0];
}

async function getOneUser(u) {
    const sql = `SELECT userID, firstName, lastName, userName, password FROM users WHERE userName = '${u}'`;
    const info = await dal.execute(sql);
    return info;
}

async function addUser(u) {
    const sql = `INSERT INTO users(firstName, lastName, userName, password) values('${u.firstName}', 
    '${u.lastName}', '${u.userName}', '${u.password}')`;
    const info = await dal.execute(sql);
    u.userID = info.insertId;
    return u;
}

module.exports = {
    getAllUsers, 
    getUser,
    addUser,
    getOneUser
}