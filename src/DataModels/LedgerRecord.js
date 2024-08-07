const Evidence = require('./Evidence')
const {isClassObject} = require('../middleware/auth')
const conn = require('../SQL_Connection')
const {getLastLedgerID, getLastCategoryID} = require('../middleware/generateID')
const Treasury = require('./Treasury')
const { sqlToStringDate } = require('../middleware/format')
class LedgerRecord {
    #title
    #description
    #amount
    #treasuryID
    #evidenceArray
    #recordID
    #createdDate
    #category
    #modifyDateTime

    constructor({title = null, description = null, amount = null, treasuryID = null, evidenceArray = [], recordID = null, createdDate = null, category = null}) {
        this.#title = title
        this.#description = description
        this.#amount = amount 
        this.#evidenceArray = evidenceArray
        this.#treasuryID = treasuryID
        this.#recordID = recordID
        this.#createdDate = createdDate
        this.#category = category?.trim()
        
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
            category: this.#category,
            createdDate: this.#createdDate
        }
    }


    // Return all the ledger records related to the given treasuryID
    static async fetchAllLedgerRecords(treasuryID) {
        let ledgerArray = [] // Empty ledger records array
        const [ledgersResult] = await conn.promise().query('SELECT record_ID, title, description, amount, time, CONVERT_TZ(created_date, "+00:00", "+05:30") AS created_date, ledger_category.name FROM ledger JOIN ledger_category ON ledger.category = ledger_category.category_ID WHERE treasury_ID = ? ORDER BY record_ID DESC',
            [treasuryID]
        )

        for(let element of ledgersResult) {
            const evidenceArray = await Evidence.fetchAllEvidence(element.record_ID)
            const ledger = new LedgerRecord({
                treasuryID: treasuryID,
                recordID: element.record_ID,
                category: element.name,
                title: element.title,
                description: element.description,
                amount: element.amount,
                createdDate: sqlToStringDate(element.created_date).toString().slice(0, 11) + "#" + element.time.toString().slice(0, 5),
                evidenceArray: evidenceArray
            })
            ledgerArray.push(ledger)
        }

        return ledgerArray
    }


    // Creating new ledger record in the SQL database 
    async createNewRecord() {
        // Separating data and time into two columns
        const dateTime = this.#createdDate.split('#')

        // Check whether the inserted category existed in the database
        let categoryID = null
        if(this.#category !== null && this.#category.toString() !== "") {
            const [categoryResult] = await conn.promise().query('SELECT category_ID FROM ledger_category JOIN ledger ON ledger.category = ledger_category.category_ID WHERE ledger.treasury_ID = ? AND ledger_category.name = ?', [this.#treasuryID, this.#category])

            if(categoryResult.length === 0) {
                // New category identified 
                categoryID = await getLastCategoryID()
                // Insert new category
                await conn.promise().query('INSERT INTO ledger_category VALUES (?, ?)', [categoryID, this.#category])
            } else {
                categoryID = categoryResult[0]['category_ID']
            }
        }
        

        if(this.#recordID === null) this.#recordID = await getLastLedgerID() // Creating ledger record ID
        // Creating new ledger record
        const [result] = await conn.promise().query('INSERT INTO ledger (record_ID, treasury_ID, title, description, amount, created_date, time, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [this.#recordID, this.#treasuryID, this.#title, this.#description, this.#amount, dateTime[0], dateTime[1], categoryID])
        this.#modifyDateTime = dateTime

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


    // Fetch all the categories relevant to the treasury ID
    async fetchAllLedgerCategories() {
        const [categoryResult] = await conn.promise().query('SELECT DISTINCT ledger_category.name FROM ledger_category JOIN ledger ON ledger.category = ledger_category.category_ID WHERE ledger.treasury_ID = ?', [this.#treasuryID])
        return categoryResult.map(element=> element['name'])
    }

    

    // Getters and Setters
    getModifiedDateTime() {
        return this.#modifyDateTime
    }

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