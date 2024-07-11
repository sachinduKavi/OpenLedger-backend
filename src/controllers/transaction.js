const crypto = require('crypto')


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


const paymentSuccess = async (req, res) => {
    
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


module.exports = {
    generateHash,
    paymentNotification
}