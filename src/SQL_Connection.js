const mysql = require('mysql2/promise')


// Initializing the sql Connection for the database 
const conn = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'open_ledger'
})


module.exports = conn