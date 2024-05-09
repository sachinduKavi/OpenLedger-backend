const mysql = require('mysql2')


// Initializing the sql Connection for the database 
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'open_ledger'
})

// const conn = mysql.createConnection({
//     host: '104.197.138.178',
//     user: 'open_ledger',
//     port: '3306',
//     password: 'ledgerpass',
//     database: 'open_ledger'
// })


module.exports = conn