const dal = require("../dal/dal");

async function getAllFollows() {
    const sql = `SELECT * FROM follows`;
    const info = await dal.execute(sql);
    return info;
}

async function getFollowsFromOneUser(userID) {
    const sql = `SELECT follows.userID, follows.vacationID, describePlace, destination, startDate, 
        endDate, image, price FROM follows JOIN vacations on vacations.vacationID = follows.vacationID
        JOIN users ON users.userID = follows.userID WHERE follows.userID = ${userID}`;
    const info = await dal.execute(sql);
    return info;
}

async function getFollow(userID, vacationID) {
    const sql = `SELECT * FROM follows WHERE userID = ${userID} AND vacationID = ${vacationID}`;
    const info = await dal.execute(sql);
    return info;
}

async function addFollow(f) {
    const sql = `INSERT INTO follows(vacationID, userID) values(${f.vacationID}, ${f.userID})`;
    const info = await dal.execute(sql);
    u.userID = info.insertId;
    return u;
}

async function deleteFollow(userID, vacationdID) {
    const sql = `DELETE FROM follows WHERE userID = ${userID} AND vacationID = ${vacationdID}`;
    await dal.execute(sql);
}

async function deleteFollowByVacation(vacationdID) {
    const sql = `DELETE FROM follows WHERE vacationID = ${vacationdID}`;
    await dal.execute(sql);
}

module.exports = {
    getAllFollows,
    getFollowsFromOneUser,
    getFollow,
    addFollow,
    deleteFollow,
    deleteFollowByVacation
}