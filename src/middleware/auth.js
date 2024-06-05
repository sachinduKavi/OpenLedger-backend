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
    return obj.constructor && obj.constructor !== Object
} 

module.exports = {isAuthenticated, isClassObject}