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


// FreeDb 
// const conn = mysql.createConnection({
//     host: 'sql.freedb.tech',
//     user: 'freedb_ledger_user',
//     password: '6n&tyApRQ2Km6JC',
//     database: 'freedb_open_ledger'
// })


// const conn = mysql.createConnection({
//     host: '104.197.138.178',
//     user: 'open_ledger',
//     port: '3306',
//     password: 'ledgerpass',
//     database: 'open_ledger'
// })


// Host: sql8.freesqldatabase.com
// Database name: sql8717865
// Database user: sql8717865
// Database password: RRyxYhiVkt
// Port number: 3306

// Free sql db Shechans account
// const conn = mysql.createConnection({
//     host: 'sql8.freesqldatabase.com',
//     user: 'sql8717865',
//     password: 'RRyxYhiVkt',
//     database: 'sql8717865'
// })


// Pethum SQL db password = Ledger@pass
// Host: sql8.freesqldatabase.com
// Database name: sql8719852
// Database user: sql8719852
// Database password: E4z8VKeiwy
// Port number: 3306

// const conn = mysql.createConnection({
//     host: 'sql8.freesqldatabase.com',
//     user: 'sql8719852',
//     password: 'E4z8VKeiwy',
//     database: 'sql8719852'
// })


// const conn = mysql.createConnection({
//     host: 'sql3.freesqldatabase.com',
//     user: 'sql3721986',
//     password: 'jXwnNaF26L',
//     database: 'sql3721986'
// })



// Host: sql12.freesqldatabase.com
// Database name: sql12.freesqldatabase.com
// Database user: sql12739302
// Database password: zQJDpPfqgH
// Port number: 3306

// const conn = mysql.createConnection({
//         host: 'sql12.freesqldatabase.com',
//         user: 'sql12739302',
//         password: 'zQJDpPfqgH',
//         database: 'sql12739302'
//     })
module.exports = conn