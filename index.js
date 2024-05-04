// const express = require('express')
const conn = require('./src/SQL_Connection')
const Fleet = require('./custom_package/fleet')
const fleetApp = new Fleet() // Create instant of the fleet custom package 

const userRouter = require('./src/routes/user')


const PORT = 3000

// Test connection with the mysql database 
conn.connect((err) => {
    if (err) throw err
    console.log('MySql Database is connected...')
})

fleetApp.use('/user', userRouter)


fleetApp.listen(PORT, () => {
    console.log('API is running on the port ' + PORT + '...')
})