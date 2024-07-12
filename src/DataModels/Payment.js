const { getPaymentID } = require('../middleware/generateID')
const conn = require('../SQL_Connection')
const LedgerRecord = require('../DataModels/LedgerRecord')
const Collection = require('../DataModels/Collection')
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


    constructor({paymentID = 'AUTO', treasuryID = null, userID = null, status = null, amount = 0, date = null, reference = "", note = null, evidence = null, onlinePayment = true, fromCollection = false}) {
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
            fromCollection: this.#fromCollection
        }
    }


    // You need to set userID and treasuryID manually 
    // Create new payment record in the database
    async newPaymentRecord() {
        // Generating new payment ID if not exists
        if(this.#paymentID === "AUTO") this.#paymentID = await getPaymentID()
        
            // Insert record to sql database
        await conn.promise().query('INSERT INTO payment(payment_ID, treasury_ID, user_ID, online_payment, status, amount, date, reference, note) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [this.#paymentID, this.#treasuryID , this.#userID, this.#onlinePayment, this.#status, this.#amount, this.#date, this.#reference, this.#note]
        )

        // If the payment is a verified 
        //  * ledger record is added
        //  * Paid amount in the collection is updated if it only related for collection 
        if(this.#status === "VERIFIED") {
            if(this.#fromCollection) {
                // Payment is for collection 
                const collection = new Collection({collectionID: this.#reference})
                await collection.updatePaidAmount(this.#userID, this.#amount) // Update treasury participant
            }

            // Creating ledger instant
            const ledger = new LedgerRecord({
                title: "Collection payment",
                description: `User ${this.#userID} has paid LKR ${this.#amount} for the collection ${this.#reference}`,
                amount: this.#amount,
                treasuryID: this.#treasuryID,
                createdDate: this.#date + "#" + "00:00",
                category: "Collection"
            })

            await ledger.createNewRecord() // Creating new ledger record

        }
    }


    calAmountWithTax() {
        return this.#amount*1.03
    }

    
    // Getters & Setters
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