const crypto = require('crypto')
const Payment = require('../DataModels/Payment')
const {verifyToken} = require('../middleware/JWT')
const {parseCookies} = require('../middleware/Cookies')



// Generate hash code for payment process 
const generateHash = async (req, res) => {
    let proceed = true, errorMessage = null, content = null
    console.log('generate hash')

    const { merchant_id, order_id, amount, currency, merchant_secret } = req.body

    const hash = crypto.createHash('md5').update(
        merchant_id +
        order_id +
        amount.toFixed(2) +
        currency +
        crypto.createHash('md5').update(merchant_secret).digest('hex').toUpperCase()
    ).digest('hex').toUpperCase()

    content = hash

    res.end(JSON.stringify({
        proceed: proceed,
        content: content,
        errorMessage: errorMessage
    }))
}


// Payment counter as success
const paymentSuccess = async (req, res) => {
    let proceed = true, errorMessage = null, content = null // Process variables
    
    // Verify user token
    const [token, tokenError] = verifyToken(parseCookies(req).user_token)
    if(token) {
        // New payment instant 
        const payment = new Payment(req.body)
        payment.setUserID(token.user_ID)
        payment.setTreasuryID(token.treasury_ID)

        await payment.newPaymentRecord()
    } else {
        // Invalid token
        proceed = false 
        errorMessage = tokenError
    }
    

    res.end(JSON.stringify({
        proceed: proceed,
        errorMessage: errorMessage,
        content: content
    }))
}



// Payment notification function to Payhere API
const paymentNotification = async (req, res) => {

    const {
        merchant_id,
        order_id,
        payment_id,
        payhere_amount,
        payhere_currency,
        status_code,
        md5sig,
        custom_1,
        custom_2
      } = req.body
    
    console.log('Inside the payment notification')

    console.log('payment notification', merchant_id,
        order_id,
        payment_id,
        payhere_amount,
        payhere_currency,
        status_code,
        md5sig,
        custom_1,
        custom_2)

    res.end(JSON.stringify({}))
}


// Load all the payments related to treasury group
const loadAllTreasuryTransactions = async (req, res) => {
    console.log('Loading payments')
    let proceed = true, content = null, errorMessage = null

    // Verify user token
    const [token, tokenError] = verifyToken(parseCookies(req).user_token)
    if(token) {
        const payment = new Payment({treasuryID: token.treasury_ID})
        const collectionArray = await payment.fetchAllPayments()
        content = collectionArray.map(element => {
            return (element.extractJSON())
        })
    } else {
        // Token is invalid
        proceed = false
        errorMessage = tokenError
    }



    res.end(JSON.stringify({
        proceed: proceed,
        content: content,
        errorMessage: errorMessage
    }))
}


// Payment status modification 
const stateModify = async (req, res) => {
    console.log('state modify')
    let proceed = true, content = null, errorMessage = null // Process variables

    // Verify user token 
    const [token, tokenError] = verifyToken(parseCookies(req).user_token)
    if(token) {
        // Creating payment instant
        const payment = new Payment(req.body.payment)
        await payment.updatePaymentApproved(req.body.updateRecord)
      
    } else {
        // Invalid token
        proceed = false
        errorMessage = tokenError
    }


    res.end(JSON.stringify({
        proceed: proceed,
        content: content,
        errorMessage: errorMessage
    }))


}



// Payment status is decremented 
const decrementStatus = async (req, res) => {
    console.log('decrement')
    let proceed = true, content = null, errorMessage = null // Process variables

    // Verify user token 
    const [token, tokenError] = verifyToken(parseCookies(req).user_token)
    if(token) {
        // Creating payment instant
        const payment = new Payment(req.body.payment)
        await payment.decrementPayment()
    } else {
        // Invalid token
        proceed = false
        errorMessage = tokenError
    }


    res.end(JSON.stringify({
        proceed: proceed,
        content: content,
        errorMessage: errorMessage
    }))


}







module.exports = {
    generateHash,
    paymentNotification,
    paymentSuccess,
    loadAllTreasuryTransactions,
    stateModify,
    decrementStatus
}