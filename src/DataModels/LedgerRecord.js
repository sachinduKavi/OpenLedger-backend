const Evidence = require('./Evidence')
const {isClassObject} = require('../middleware/auth')
const conn = require('../SQL_Connection')
const {getLastLedgerID} = require('../middleware/generateID')
const Treasury = require('./Treasury')
class LedgerRecord {
    #title
    #description
    #amount
    #treasuryID
    #evidenceArray
    #recordID
    #createdDate


    constructor({title = null, description = null, amount = null, treasuryID = null, evidenceArray = null, recordID = null, createdDate = null}) {
        this.#title = title
        this.#description = description
        this.#amount = amount 
        this.#evidenceArray = evidenceArray
        this.#treasuryID = treasuryID
        this.#recordID = recordID
        this.#createdDate = createdDate
        
        if (this.#evidenceArray.length > 0 && !isClassObject(this.#evidenceArray[0])) this.#convertToEvidenceObject()
    }


    // Converting Object array to class object array
    #convertToEvidenceObject() {
        let tempObjectArray = []
        this.#evidenceArray.forEach(element => {
            tempObjectArray.push(new Evidence(element))
        });
        this.#evidenceArray = tempObjectArray
    }


    extractJSON() {
        // Implementing array with all the evidence 
        let evidence = []
        this.#evidenceArray.forEach(element => {
            evidence.push(element.extractJSON()) 
          })

        return {
            title: this.#title,
            description: this.#description,
            amount: this.#amount,
            treasuryID: this.#treasuryID,
            evidenceArray: evidence,
            createdDate: this.#createdDate
        }
    }


    // Return all the ledger records related to the given treasuryID
    static async fetchAllLedgerRecords(treasuryID) {
        let ledgerArray = [] // Empty ledger records array
        const [ledgersResult] = await conn.promise().query('SELECT record_ID, title, description, amount, time, created_date FROM ledger WHERE treasury_ID = ? ORDER BY record_ID DESC',
            [treasuryID]
        )

        for(let element of ledgersResult) {
            const evidenceArray = await Evidence.fetchAllEvidence(element.record_ID)
            const ledger = new LedgerRecord({
                treasuryID: treasuryID,
                recordID: element.record_ID,
                title: element.title,
                description: element.description,
                amount: element.amount,
                createdDate: element.created_date.toString().slice(0, 11) + "#" + element.time.toString().slice(0, 5),
                evidenceArray: evidenceArray
            })
            ledgerArray.push(ledger)
        }

        return ledgerArray
    }


    // Creating new ledger record in the SQL database 
    async createNewRecord() {
        console.log('creating new database record...')

        // Separating data and time into two columns
        const dateTime = this.#createdDate.split('#')

        if(this.#recordID === null) this.#recordID = await getLastLedgerID() // Creating ledger record ID
        // Creating new ledger record
        const [result] = await conn.promise().query('INSERT INTO ledger (record_ID, treasury_ID, title, description, amount, created_date, time) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [this.#recordID, this.#treasuryID, this.#title, this.#description, this.#amount, dateTime[0], dateTime[1]])

        // Create Evidence records
        for(let i = 0; i < this.#evidenceArray.length; i++) {
            await this.#evidenceArray[i].createEvidence(this.#recordID)
        }

        // Update treasury balance 
        if(this.#amount !== 0) {
            const treasury = new Treasury({treasuryID: this.#treasuryID}) // New treasury instant
            await treasury.updateTreasuryBalance(this.#amount)
        }
        
        return result.affectedRows > 0
    }   



    // Getters and Setters
    getCreatedDate(){
        return this.#createdDate
    }

    setCreatedDate(createdDate) {
        this.#createdDate = createdDate
    }


    getTreasuryID() {
        return this.#treasuryID
    }

    setTreasuryID(treasuryID) {
        this.#treasuryID = treasuryID
    }


    getTitle() {
        return this.#title;
    }

    setTitle(title) {
        this.#title = title;
    }

    getDescription() {
        return this.#description;
    }

    setDescription(description) {
        this.#description = description;
    }

    getAmount() {
        return this.#amount;
    }

    setAmount(amount) {
        this.#amount = amount;
    }

    getEvidenceArray() {
        return this.#evidenceArray;
    }

    setEvidenceArray(evidenceArray) {
        this.#evidenceArray = evidenceArray;
    }

}


module.exports = LedgerRecord