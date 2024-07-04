const conn = require('./src/SQL_Connection')
const Fleet = require('./custom_package/fleet')
const fleetApp = new Fleet() // Create instant of the fleet custom package 

const userRouter = require('./src/routes/user')
const treasuryRouter = require('./src/routes/treasury')
const ledgerRouter = require('./src/routes/ledger')
const estimationRouter = require('./src/routes/estimation')
const cashflowRouter = require('./src/routes/cashflow')
const collectionRouter = require('./src/routes/collection')

const PORT = 3500


// Test connection with the mysql database 
conn.connect((err) => {
    if (err) throw err
    console.log('MySql Database is connected...')
})

fleetApp.use('/user', userRouter)

fleetApp.use('/treasury', treasuryRouter)

fleetApp.use('/ledger', ledgerRouter)

fleetApp.use('/estimation', estimationRouter)

fleetApp.use('/cashflow', cashflowRouter)

fleetApp.use('/collection', collectionRouter)



fleetApp.listen(PORT, () => {
    console.log('API is running on the port ' + PORT + '...')
})