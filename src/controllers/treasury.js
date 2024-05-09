const conn = require('../SQL_Connection')


const createTreasury = (req, res) => {
    console.log('Create new treasury...')

    res.end(JSON.stringify({
        body: req.body
    }))
}


module.exports = {
    createTreasury
}