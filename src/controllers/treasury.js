const conn = require('../SQL_Connection')


// Create new treasury step 01 
const createTreasury = (req, res) => {
    console.log('Create new treasury...')

    console.log(req.body)

    res.end(JSON.stringify({
        body: req.body
    }))
}


module.exports = {
    createTreasury
}