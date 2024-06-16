const {getStatusID} = require('../middleware/generateID')
const conn = require('../SQL_Connection')

class Status {
    #statusID
    #treasuryID
    #intervenerID
    #modification
    #dateTime

    constructor({statusID = null, treasuryID = null, intervenerID = null, modification = null, dateTime = null}) {
        this.#statusID = statusID
        this.#treasuryID = treasuryID
        this.#intervenerID = intervenerID
        this.#modification = modification
        this.#dateTime = dateTime
    }

    // Check whether the status ID is null
    // IF this is new status it will generate new status ID
    async buildNewID() {
        if(this.#statusID === null)
        this.#statusID = await getStatusID()
    }   

    // Create a new status record in the database
    async createStatusRecord() {
        const [createStatus] = await conn.promise().query('INSERT INTO treasury_status (status_ID, treasury_ID, intervener, modification, date) VALUES (?, ?, ?, ?, ?)',
            [this.#statusID, this.#treasuryID, this.#intervenerID, this.#modification, this.#dateTime]
        )
        return createStatus
    }

    extractJSON() {
        return {
            statusID: this.#statusID,
            treasuryID: this.#treasuryID,
            intervenerID: this.#intervenerID,
            modification: this.#modification,
            dateTime: this.#dateTime
        }
    }


    // Getters and Setters
    getStatusID() {
        return this.#statusID
    }

    
}

module.exports = Status