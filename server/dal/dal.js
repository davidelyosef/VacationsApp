const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "vacations_database"
});

connection.connect(err => {
    if (err) throw err;
    console.log("Connected to MySQL");
});

async function execute(sql) {
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) throw err;
            resolve(result);
        });
    });
}

module.exports = { execute };