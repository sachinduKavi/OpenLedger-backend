const mysql = require('mysql2')


// Initializing the sql Connection for the database 
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'open_ledger'
})


module.exports = conn