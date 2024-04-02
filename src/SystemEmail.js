const nodemailer = require('nodemailer')

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'skcode2001@gmail.com',
        pass: 'kzoxkunktavwdrof'
    }
})

async function sendAuthMail(receiverEmail, randomCode = 4545) {
    const mailOptions = {
        from: 'skcode2001@gmail.com',
        to: receiverEmail.toString(),
        subject: 'Verification Code for OpenLedger',
        html: "<h1>Thank you for choosing open ledger</h1>" + `<h3> Your verification code : ${randomCode}`
    }

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function(err, info) {
            if(err) {
                console.log(err)
                resolve(false)
            }else {
                console.log('Email sent successfully...')
                resolve(true)
            }
        })

    })
}

module.exports = {
    sendAuthMail
}