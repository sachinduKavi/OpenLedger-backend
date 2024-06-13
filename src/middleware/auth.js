const Member = require('../DataModels/Member')
const Chair = require('../DataModels/Chair')
const CoTreasurer = require('../DataModels/CoTreasurer')
const Treasurer = require('../DataModels/Treasurer')

const isAuthenticated = (req, res, next) => {
    const authHeader = req.headers.authorization
    console.log("Authorization header: " + authHeader)
    
    if(authHeader.split(" ")[1] == "openLedger") next()
    else {
        res.status(401).json({
            authorization: false
        })
    }
    

}


// This function can use to separate Class object and normal Objects 
// Function will  return true if the object is a class object 
const isClassObject = (obj) => {
    try{
        return obj.constructor && obj.constructor !== Object
    } catch (e) {
        return true // No evidence record is present 
    }
    
} 


const userCategorize = (userRole, userDetails) => {
    switch(userRole) {
        case 'Treasurer':
            return new Treasurer(userDetails)
        case 'CoTreasurer':
            return new CoTreasurer(userDetails)
        case 'Chair':
            return new Chair(userDetails)
        case 'Member':
            return new Member(userDetails)

    }
}



module.exports = {isAuthenticated, isClassObject, userCategorize}