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

module.exports = {isAuthenticated}