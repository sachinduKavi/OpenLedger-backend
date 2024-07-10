class Payment {
    #paymentID
    #treasuryID
    #userID
    #status
    #amount
    #date
    #reference
    #note


    constructor({paymentID = null, treasuryID = null, userID = null, status = null, amount = null, date = null, reference = null, note = null}) {
        this.#paymentID = paymentID
        this.#treasuryID = treasuryID
        this.#userID = userID
        this.#status = status
        this.#amount = amount
        this.#date = date
        this.#reference = reference
        this.#note = note
        
    }


    extractJSON() {
        return  {
            paymentID: this.#paymentID,
            treasuryID: this.#treasuryID,
            userID: this.#userID,
            status: this.#status,
            amount: this.#amount,
            date: this.#date,
            reference: this.#reference,
            note: this.#note
        }
    }



    // Getters
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