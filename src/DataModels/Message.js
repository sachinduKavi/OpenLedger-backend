const {createID} = require('../middleware/generateID')
const conn = require('../SQL_Connection')

class Message {
    #chatID
    #treasuryID
    #senderID
    #date
    #message

    constructor({chatID = 'AUTO', treasuryID = null, senderID = null, date = null, message = null}) {
        this.#chatID = chatID
        this.#treasuryID = treasuryID,
        this.#senderID = senderID
        this.#date = date
        this.#message = message
    }


    extractJSON() {
        return {
            chatID: this.#chatID,
            treasuryID: this.#treasuryID,
            senderID: this.#senderID,
            date: this.#date,
            message: this.#message
        }
    }

    // Save new ID in the database
    async saveChat() {
        if(this.#chatID === 'AUTO') {
            this.#chatID = await createID('ledger_chat', 'chat_ID', 'CT00')

            await conn.promise().query('INSERT INTO ledger_chat (chat_ID, treasury_ID, sender_ID, date, message) VALUES (?, ?, ?, ?, ?)'
                [this.#chatID, this.#treasuryID, this.#senderID, this.#date, this.#message]
            )
        }
    }


    // getters and setters
    getChatID() {
        return this.#chatID
    }

    setChatID(chatID) {
        this.#chatID = chatID
    }

    getTreasuryID() {
        return this.#treasuryID
    }

    setTreasuryID(treasuryID) {
        this.#treasuryID = treasuryID
    }

    getSenderID() {
        return this.#senderID
    }

    setSenderID(senderID) {
        this.#senderID = senderID
    }

    getDate() {
        return this.#date
    }

    setDate(date) {
        this.#date = date
    }

    getMessage() {
        return this.#message
    }

    setMessage(message) {
        this.#message = message
    }
}

module.exports = Message