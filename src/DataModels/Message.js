const { sqlToStringDate } = require('../middleware/format')
const {createID} = require('../middleware/generateID')
const conn = require('../SQL_Connection')

class Message {
    #chatID
    #treasuryID
    #senderID
    #date
    #message
    #senderName

    constructor({chatID = 'AUTO', treasuryID = null, senderID = null, date = null, message = null, senderName = null}) {
        this.#chatID = chatID
        this.#treasuryID = treasuryID,
        this.#senderID = senderID
        this.#date = date
        this.#message = message
        this.#senderName = senderName
    }


    extractJSON() {
        return {
            chatID: this.#chatID,
            treasuryID: this.#treasuryID,
            senderID: this.#senderID,
            date: this.#date,
            message: this.#message,
            senderName: this.#senderName
        }
    }


    static async fetchMessageBlock(n, treasuryID) {
        const [blockResult] = await conn.promise().query('SELECT chat_ID, sender_ID, date, message, user_name FROM ledger_chat JOIN user ON user.user_ID = ledger_chat.sender_ID WHERE treasury_ID = ? ORDER BY chat_ID DESC LIMIT 50 OFFSET ?', 
            [treasuryID, n*50])

        return blockResult.map(element => {
            return new Message({
                chatID: element.chat_ID,
                senderID: element.sender_ID,
                date: sqlToStringDate(element.date),
                message: element.message,
                senderName: element.user_name,
                treasuryID: treasuryID
            })
        })
    }


    // Save new ID in the database
    async saveChat() {
        if(this.#chatID === 'AUTO') {
            this.#chatID = await createID('ledger_chat', 'chat_ID', 'CT00')

            await conn.promise().query('INSERT INTO ledger_chat(chat_ID, treasury_ID, sender_ID, date, message) VALUES (?, ?, ?, ?, ?)',
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