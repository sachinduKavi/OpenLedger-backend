const conn = require('../SQL_Connection')

// Creating new ID by incrementing the last ID
function generateID(lastIdentity) {
    const prefix = lastIdentity.slice(0, 2), numID = parseInt(lastIdentity.slice(2))+1
    let newID = prefix
    for(let i = 0; i < 16-numID.toString().length; i++) newID += "0"
    newID += numID
    console.log(newID)
    return newID
}


// Find the last image ID in the database
async function getLastPictureID() {
    const [imageID] = await conn.promise().query('SELECT image_id FROM image_ref ORDER BY image_id DESC LIMIT 1').catch(err => {
        throw err
    })

    return (imageID.length == 0)
        ? generateID('IR00')
        : generateID(imageID[0]['image_id'])
}


// Find the last image ID in the database
async function getLastCategoryID() {
    const [catID] = await conn.promise().query('SELECT category_ID FROM ledger_category ORDER BY category_ID DESC LIMIT 1').catch(err => {
        throw err
    })

    return (catID.length == 0)
        ? generateID('CT00')
        : generateID(catID[0]['category_ID'])
}


// Get the last used treasury ID
const getLastTreasuryID = async  () => {
    const [userID] = await conn.promise().query('SELECT treasury_ID FROM treasury ORDER BY treasury_ID DESC LIMIT 1').catch(err => {
        throw err
    })
    return (userID.length == 0)
        ? generateID('TS00')
        : generateID(userID[0]['treasury_ID'])
}


// Get the last used status ID
const getStatusID = async  () => {
    const [stateID] = await conn.promise().query('SELECT status_ID FROM treasury_status ORDER BY status_ID DESC LIMIT 1').catch(err => {
        throw err
    })
    return (stateID.length == 0)
        ? generateID('ST00')
        : generateID(stateID[0]['status_ID'])
}


// Get the last used ledger ID
const getLastLedgerID = async  () => {
    const [userID] = await conn.promise().query('SELECT record_ID FROM ledger ORDER BY record_ID DESC LIMIT 1').catch(err => {
        throw err
    })
    return (userID.length == 0)
        ? generateID('LR00')
        : generateID(userID[0]['record_ID'])
}


// Get the last used EVIDENCE ID
const getEvidenceID = async  () => {
    const [userID] = await conn.promise().query('SELECT evidence_ID FROM evidence ORDER BY evidence_ID DESC LIMIT 1').catch(err => {
        throw err
    })
    return (userID.length == 0)
        ? generateID('EV00')
        : generateID(userID[0]['evidence_ID'])
}

// Get the last used estimation ID
const getEstimationID = async  () => {
    const [estimationID] = await conn.promise().query('SELECT estimation_ID FROM estimation ORDER BY estimation_ID DESC LIMIT 1').catch(err => {
        throw err
    })
    return (estimationID.length == 0)
        ? generateID('ES00')
        : generateID(estimationID[0]['estimation_ID'])
}

const getExpenseID = async  () => {
    const [expenseID] = await conn.promise().query('SELECT expense_ID FROM expense ORDER BY expense_ID DESC LIMIT 1').catch(err => {
        throw err
    })
    return (expenseID.length == 0)
        ? generateID('EX00')
        : generateID(expenseID[0]['expense_ID'])
}

// Generate cash flow report ID
const getCashflowReportID = async  () => {
    const [cashID] = await conn.promise().query('SELECT cashflow_reportID FROM cashflow_report ORDER BY cashflow_reportID DESC LIMIT 1').catch(err => {
        throw err
    })
    return (cashID.length == 0)
        ? generateID('CF00')
        : generateID(cashID[0]['cashflow_reportID'])
}

// Generate cash flow report ID
const getCollectionID = async  () => {
    const [collectionID] = await conn.promise().query('SELECT collection_ID FROM collection ORDER BY collection_ID DESC LIMIT 1').catch(err => {
        throw err
    })
    return (collectionID.length == 0)
        ? generateID('CL00')
        : generateID(collectionID[0]['collection_ID'])
}


// Generate payment ID
const getPaymentID = async  () => {
    const [paymentID] = await conn.promise().query('SELECT payment_ID FROM payment ORDER BY payment_ID DESC LIMIT 1').catch(err => {
        throw err
    })
    return (paymentID.length == 0)
        ? generateID('PY00')
        : generateID(paymentID[0]['payment_ID'])
}

// Generate announcement ID
const getAnnouncementID = async  () => {
    const [announcementID] = await conn.promise().query('SELECT announcement_ID FROM announcement ORDER BY announcement_ID DESC LIMIT 1').catch(err => {
        throw err
    })
    return (announcementID.length == 0)
        ? generateID('AN00')
        : generateID(announcementID[0]['announcement_ID'])
}

// Generate comment ID
const getCommentID = async  () => {
    const [commentID] = await conn.promise().query('SELECT comment_ID FROM comments ORDER BY comment_ID DESC LIMIT 1').catch(err => {
        throw err
    })
    return (commentID.length == 0)
        ? generateID('CM00')
        : generateID(commentID[0]['comment_ID'])
}

// Generate ID for any table
const createID = async  (tableName, columnName, prefix) => {
    const [commonID] = await conn.promise().query(`SELECT ${columnName} FROM ${tableName} ORDER BY ${columnName} DESC LIMIT 1`).catch(err => {
        throw err
    })
    return (commonID.length == 0)
        ? generateID(prefix)
        : generateID(commonID[0][columnName])
}


module.exports = {
    getLastTreasuryID,
    getLastPictureID,
    getLastLedgerID,
    getEvidenceID,
    getExpenseID,
    getEstimationID,
    getLastCategoryID,
    getStatusID,
    getCashflowReportID,
    getCollectionID,
    getPaymentID,
    getAnnouncementID,
    getCommentID,
    createID
}