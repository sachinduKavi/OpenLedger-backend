const Evidence = require('./Evidence')
const {isClassObject} = require('../middleware/auth')
const conn = require('../SQL_Connection')
const {getLastLedgerID} = require('../middleware/generateID')
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
        
        if (!isClassObject(this.#evidenceArray[0])) this.#convertToEvidenceObject()
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


    // Creating new ledger record in the SQL database 
    async createNewRecord() {
        console.log('creating new database record...')
        if(this.#recordID === null) this.#recordID = await getLastLedgerID() // Creating ledger record ID
        await conn.promise().query('INSERT INTO ledger (record_ID, treasury_ID, title, description, amount, created_date)')
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