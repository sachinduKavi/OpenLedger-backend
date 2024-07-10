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


const paymentNotification = async (req, res) => {
    console.log('payment notification', req)

    res.end()
}


module.exports = {
    generateHash,
    paymentNotification
}