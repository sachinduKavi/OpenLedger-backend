const { getPaymentID } = require('../middleware/generateID')
const conn = require('../SQL_Connection')
const LedgerRecord = require('../DataModels/LedgerRecord')
const Collection = require('../DataModels/Collection')
const { sqlToStringDate } = require('../middleware/format')
class Payment {
    #paymentID
    #treasuryID
    #userID
    #status
    #amount
    #date
    #reference
    #evidence
    #onlinePayment
    #fromCollection
    #note
    #userName


    constructor({paymentID = 'AUTO', treasuryID = null, userID = null, status = null, amount = 0, date = null, reference = "", note = null, evidence = null, onlinePayment = true, fromCollection = false, userName = null}) {
        this.#paymentID = paymentID
        this.#treasuryID = treasuryID
        this.#userID = userID
        this.#status = status
        this.#amount = amount
        this.#date = date
        this.#reference = reference
        this.#note = note
        this.#fromCollection = fromCollection
        this.#onlinePayment = onlinePayment
        this.#evidence = evidence
        this.#userName = userName
    }


    extractJSON() {
        return  {
            paymentID: this.#paymentID,
            treasuryID: this.#treasuryID,
            userID: this.#userID,
            status: this.#status,
            amount: this.#amount,
            date: this.#date,
            onlinePayment: this.#onlinePayment,
            reference: this.#reference,
            note: this.#note,
            evidence: this.#evidence,
            fromCollection: this.#fromCollection,
            userName: this.#userName
        }
    }


    // You need to set userID and treasuryID manually 
    // Create new payment record in the database
    async newPaymentRecord() {
        // Generating new payment ID if not exists
        if(this.#paymentID === "AUTO") this.#paymentID = await getPaymentID()
        console.log(this.#evidence , 'Evidence print ')
            // Insert record to sql database
        await conn.promise().query('INSERT INTO payment(payment_ID, treasury_ID, user_ID, online_payment, status, amount, date, reference, note, evidence) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [this.#paymentID, this.#treasuryID , this.#userID, this.#onlinePayment, this.#status, this.#amount, this.#date, this.#reference, this.#note, this.#evidence]
        )

        await this.finalizePayment()
        
    }


    // If the payment is a verified 
    //  * ledger record is added
    //  * Paid amount in the collection is updated if it only related for collection 
    async finalizePayment() {
        if(this.#status === "VERIFIED") {
            if(this.#fromCollection) {
                // Payment is for collection 
                const collection = new Collection({collectionID: this.#reference})
                await collection.updatePaidAmount(this.#userID, this.#amount, this.#date) // Update treasury participant
            }

            // Creating ledger instant
            const ledger = new LedgerRecord({
                title:  "Payment " + this.#reference + " is " + this.#status,
                description: this.#fromCollection? `User ${this.#userID} has paid LKR ${this.#amount} for the collection ${this.#reference}`
                : this.#note,
                amount: this.#amount,
                treasuryID: this.#treasuryID,
                createdDate: this.#date + "#" + "00:00",
                category: this.#fromCollection? "Collection" : "Payment"
            })

            await ledger.createNewRecord() // Creating new ledger record

        }
    }


    // Update payment state 
    async updatePaymentApproved(updateRecord) {
        await conn.promise().query('UPDATE payment SET status = ? WHERE payment_ID = ?',
            [this.#status, this.#paymentID]
        )
        if(updateRecord)
            this.finalizePayment()
    }

    // Payment is decremented
    async decrementPayment() {
        await conn.promise().query('UPDATE payment SET status = ? WHERE payment_ID = ?',
            [this.#status, this.#paymentID]
        )

        if(this.#fromCollection) {
            // Payment is for collection 
            const collection = new Collection({collectionID: this.#reference})
            await collection.updatePaidAmount(this.#userID, this.#amount/-1, this.#date) // Update treasury participant
        }

        // Creating ledger instant
        const ledger = new LedgerRecord({
            title: "Payment is " + this.#status,
            description: `Payment ${this.#paymentID} has been disapproved, and the amount has been refunded`,
            amount: this.#amount/-1,
            treasuryID: this.#treasuryID,
            createdDate: this.#date + "#" + "00:00",
            category: this.#fromCollection? "Collection" : "Payment"
        })

        await ledger.createNewRecord() // Creating new ledger record

    }


    // Load all the payments records
    async fetchAllPayments() {
        const [paymentResults] = await conn.promise().query('SELECT payment_ID, user_name, online_payment, status, amount, CONVERT_TZ(date, "+00:00", "+05:30") AS date, reference, note, evidence FROM payment JOIN user ON user.user_ID = payment.user_ID WHERE treasury_ID = ? ORDER BY payment_ID DESC',
            [this.#treasuryID]
        )

        let paymentArray = []
        // Converting them to payment instant
        paymentResults.forEach(element => {
            paymentArray.push(new Payment({
                treasuryID: this.#treasuryID,
                paymentID: element.payment_ID,
                userName: element.user_name,
                onlinePayment: element.online_payment,
                status: element.status,
                amount: element.amount,
                date: sqlToStringDate(element.date),
                reference: element.reference,
                note: element.note,
                evidence: element.evidence
            }))
            
        })

        return paymentArray
    }
    


    calAmountWithTax() {
        return this.#amount*1.03
    }

    
    // Getters & Setters
    getUserName() {
        return this.#userName
    }

    setUserName(userName) {
        this.#userName = userName
    }

    getFromCollection() {
        return this.#fromCollection
    }

    setFromCollection(fromCollection) {
        this.#fromCollection = fromCollection
    }



    getOnlinePayment() {
        return this.#onlinePayment
    }

    setOnlinePayment(onlinePayment) {
        this.#onlinePayment = onlinePayment
    }


    getPaymentID() {
        return this.#paymentID
    }

    getTreasuryID() {
        return this.#treasuryID
    }

    getUserID() {
        return this.#userID
    }

    getStatus() {
        return this.#status
    }

    getAmount() {
        return this.#amount
    }

    getDate() {
        return this.#date
    }

    getReference() {
        return this.#reference
    }

    getNote() {
        return this.#note
    }

    // Setters
    setPaymentID(paymentID) {
        this.#paymentID = paymentID
    }

    setTreasuryID(treasuryID) {
        this.#treasuryID = treasuryID
    }

    setUserID(userID) {
        this.#userID = userID
    }

    setStatus(status) {
        this.#status = status
    }

    setAmount(amount) {
        this.#amount = amount
    }

    setDate(date) {
        this.#date = date
    }

    setReference(reference) {
        this.#reference = reference
    }

    setNote(note) {
        this.#note = note
    }
}


module.exports = Payment