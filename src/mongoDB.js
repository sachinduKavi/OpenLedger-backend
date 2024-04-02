const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://openLedger:openledger@openledger.qifjpmy.mongodb.net/OpenLedger',
).then(success => {
    console.log("Mongoose is connected ...")
}).catch(err => {
    console.log(err)
})

module.exports = mongoose