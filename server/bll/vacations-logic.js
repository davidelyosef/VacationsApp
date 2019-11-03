const dal = require("../dal/dal");

async function getAllVacations() {
    const sql = `SELECT * FROM vacations`;
    const info = await dal.execute(sql);
    return info;
}

async function getVacation(id) {
    const sql = `SELECT * FROM vacations WHERE vacationID = ${id}`;
    const info = await dal.execute(sql);
    return info[0];
}

async function addVacation(v, image) {
    // Sanitize
    v.destination = v.destination.replace("'", "''");
    v.describePlace = v.describePlace.replace("'", "''");
    v.image = v.image.replace("'", "''");

    const sql = `INSERT INTO vacations(describePlace, destination, startDate, endDate, image, price)
    values('${v.describePlace}', '${v.destination}', '${v.startDate}', '${v.endDate}', '${image}', ${v.price})`;
    const info = await dal.execute(sql);
    v.vacationID = info.insertId;
    return v;
}

async function updateVacation(v) {
    const sql = `UPDATE vacations set describePlace = '${v.describePlace}',destination = '${v.destination}',
    startDate = '${v.startDate}',endDate = '${v.endDate}',image = '${v.image}',
    price = ${v.price} WHERE vacationID = ${v.vacationID}`;
    await dal.execute(sql);
    return v;
}

async function deleteVacation(id) {
    const sql = `delete from vacations where vacationID = ${id}`;
    await dal.execute(sql);
}


module.exports = {
    getAllVacations,
    getVacation,
    addVacation,
    updateVacation,
    deleteVacation
}