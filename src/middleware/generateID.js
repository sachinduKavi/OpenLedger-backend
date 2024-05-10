// Creating new ID by incrementing the last ID
function createUserID(lastIdentity) {
    const prefix = lastIdentity.slice(0, 2), numID = parseInt(lastIdentity.slice(2))+1
    let newID = prefix
    for(let i = 0; i < 16-numID.toString().length; i++) newID += "0"
    newID += numID
    console.log(newID)
    return newID
}

module.exports = {
    createUserID
}