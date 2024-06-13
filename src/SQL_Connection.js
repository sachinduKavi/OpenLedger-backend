const mysql = require('mysql2')


// Initializing the sql Connection for the database 
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'open_ledger'
})

// freeDB
// const conn = mysql.createConnection({
//     host: 'sql8.freemysqlhosting.net',
//     user: 'sql8713806',
//     password: 'ItSlB4WnqU',
//     database: 'sql8713806'
// })

// const conn = mysql.createConnection({
//     host: '104.197.138.178',
//     user: 'open_ledger',
//     port: '3306',
//     password: 'ledgerpass',
//     database: 'open_ledger'
// })


module.exports = conn