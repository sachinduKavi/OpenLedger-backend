const conn = require('../SQL_Connection')
const { sqlToStringDate } = require('../middleware/format')
const {getCollectionID} = require('../middleware/generateID')
const LedgerRecord = require('./LedgerRecord')



class Collection {
    #collectionID
    #collectionName
    #amount
    #treasuryAllocation
    #dividedAmount
    #publisher
    #description
    #status
    #publishedDate
    #deadline
    #publisherName
    participantArray
    #manualAssigned

    static autoAssignCount = 0

    constructor({collectionID = 'AUTO', collectionName = null, amount = 0, treasuryAllocation = 0, description = null, publishedDate = null, deadline = null, participantArray = [], manualAssigned = 0, publisher = null, status = 'DRAFT', publisherName = null}) {
        this.#collectionID = collectionID
        this.#collectionName = collectionName
        this.#amount = amount
        this.#treasuryAllocation = treasuryAllocation
        this.#dividedAmount = amount - treasuryAllocation - manualAssigned
        this.#description = description
        this.#publishedDate = publishedDate
        this.#deadline = deadline
        this.#status = status
        this.#publisherName = publisherName
        this.#publisher = publisher
        this.participantArray = participantArray
        this.#manualAssigned = manualAssigned


    }


    extractJSON() {
        // Update manual assign value
        this.calculateManualAssign()
        return {
            collectionID: this.#collectionID,
            collectionName: this.#collectionName,
            amount: this.#amount,
            treasuryAllocation: this.#treasuryAllocation,
            dividedAmount: this.#dividedAmount,
            description: this.#description,
            publishedDate: this.#publishedDate,
            deadline: this.#deadline,
            publisher: this.#publisher,
            publisherName: this.#publisherName,
            status: this.#status,
            manualAssigned: this.#manualAssigned,
            participantArray: this.participantArray
        }
    }

    // Save collection on the database
    async saveCollectionDatabase(treasuryID) {
        if(this.#collectionID === "AUTO") {
            // Generate new collection ID
            this.#collectionID = await getCollectionID()

            // Create new collection
            await conn.promise().query('INSERT INTO collection (collection_ID, collection_name, publisher, amount, treasury_allocation, published_date, deadline, status, treasury_ID, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
                [this.#collectionID, this.#collectionName, this.#publisher, this.#amount, this.#treasuryAllocation, this.#publishedDate, this.#deadline, this.#status, treasuryID, this.#description]
            )

            // Insert new ledger record 
            // Creating ledger instant
            const ledger = new LedgerRecord({title: "Collection: " + this.#collectionName, description: this.#description, amount: this.#treasuryAllocation/-1, treasuryID: treasuryID, createdDate: `${this.#publishedDate}#00:00`, category: "Collection Published"})
            await ledger.createNewRecord() // New collection record
        } else {
            // Update existing record
            await conn.promise().query('UPDATE collection SET collection_name = ?, publisher = ?, amount = ?, treasury_allocation = ?, published_date = ?, deadline = ?, status = ?, treasury_ID = ?, description = ? WHERE collection_ID = ?', 
                [this.#collectionName, this.#publisher, this.#amount, this.#treasuryAllocation, this.#publishedDate, this.#deadline, this.#status, treasuryID, this.#description, this.#collectionID]
            )

            // Remove collection participants record
            await conn.promise().query('DELETE FROM collection_participant WHERE collection_ID = ?', [this.#collectionID])
        }


        // Creating collection participant records
        for(const element of this.participantArray) {
            await conn.promise().query('INSERT INTO collection_participant (collection_ID, user_ID, amount, paid_amount, last_update, auto_assigned) VALUES(?, ?, ?, ?, ?, ?)', 
                [this.#collectionID, element.userID, element.amount, element.paidAmount, element.lastUpdate, element.autoAssigned]
            )
        }

        // Fetch values from database
        return await this.fetchSpecifRecord()

        
    }


    // Get collection record from the database
    async fetchSpecifRecord() {
        // Get collection record
        const [collectionResult] = await conn.promise().query('SELECT collection_ID, collection_name, publisher, user_name, amount, treasury_allocation, CONVERT_TZ(published_date, "+00:00", "+05:30") AS published_date, CONVERT_TZ(deadline, "+00:00", "+05:30") AS deadline, status, description FROM collection JOIN user ON user.user_Id = collection.publisher WHERE collection_ID = ? LIMIT 1',
            [this.#collectionID]
        )

        this.#collectionName = collectionResult[0].collection_name
        this.#publisherName = collectionResult[0].user_name
        this.#publisher = collectionResult[0].publisher
        this.#amount = collectionResult[0].amount
        this.#treasuryAllocation = collectionResult[0].treasury_allocation
        this.#publishedDate = sqlToStringDate(collectionResult[0].published_date)
        this.#deadline = sqlToStringDate(collectionResult[0].deadline)
        this.#status = collectionResult[0].status
        this.#description = collectionResult[0].description

        // Fetch participant array
        this.participantArray = []
        const [participants] = await conn.promise().query('SELECT collection_participant.user_ID, amount, auto_assigned, paid_amount, CONVERT_TZ(last_update, "+00:00", "05:30") AS last_update, user_name, link FROM collection_participant JOIN user on collection_participant.user_ID = user.user_ID LEFT JOIN image_ref ON image_id = display_picture WHERE collection_ID = ?', 
            [this.#collectionID]
        )
        participants.forEach(element => {
            this.participantArray.push({
                userID: element.user_ID,
                amount: element.amount,
                autoAssigned: element.auto_assigned,
                paidAmount: element.paid_amount,
                lastUpdate: element.lastUpdate,
                dpLink: element.link,
                userName: element.user_name
            })
        })

        return this.extractJSON()
    }


    // Load collection from the database
    async fetchCollectionRecord() {
        // Check whether collection is null
        if(this.#collectionID === 'AUTO') {
            // Fetch last ID from the database
            const [collectionID] = await conn.promise().query('SELECT collection_ID FROM collection ORDER BY collection_ID DESC')
            if(collectionID.length > 0) {
                this.#collectionID = collectionID[0].collection_ID
            } else {
                // No collection exists
                return false
            }
        }

        return this.fetchSpecifRecord()
    } 


    // List all the collections related to a treasury
    // Returns a list of collection instants 
    static async fetchAllCollections(treasuryID) {
        // Easy method list all the collections ID
        const [collectionIDs] = await conn.promise().query('SELECT collection_ID from collection WHERE treasury_ID = ? ORDER BY collection_ID DESC', [treasuryID])

        // Fetching data for each collection
        let collectionArray = []
        for(const element of collectionIDs) {
            const collection = new Collection({collectionID: element.collection_ID}) // Creating collection instant
            // Fetch data from the database
            collectionArray.push(await collection.fetchSpecifRecord()) // Push values to the collection array
        }

        return collectionArray
    }


    // Delete the cashflow record from the database
    async deleteCollection() {
        // Remove all the records from the collection participant
        await conn.promise().query('DELETE FROM collection_participant WHERE collection_ID = ?', [this.#collectionID])
        // Delete record from the collection
        await conn.promise().query('DELETE FROM collection WHERE collection_ID = ?', [this.#collectionID])
    }


    calculateManualAssign() {
        this.#manualAssigned = 0
        this.participantArray.forEach(element => {
            this.#manualAssigned += parseFloat(element.amount)
        });
    }



    // Calculate the amount for one participant 
    calOneAmount() {
        return Collection.autoAssignCount !== 0 
            ? this.#dividedAmount / Collection.autoAssignCount
            : 0
    }

    incrementManualAssign(value) {
        this.#manualAssigned += parseFloat(value)
    }

    decrementManualAssign(value) {
        this.#manualAssigned -= value
    }



    // Getters & Setters
    getPublisher() {
        return this.#publisher
    }

    setPublisher(publisher) {
        this.#publisher = publisher
    }

    getStatus() {
        return this.#status
    }

    setStatus(status) {
        this.#status = status
    }

    setManualAssigned(manualAssigned) {
        this.#manualAssigned = manualAssigned
    }

    getManualAssigned() {
        return this.#manualAssigned
    }

    getCollectionID() {
        return this.#collectionID;
    }

    setCollectionID(collectionID) {
        this.#collectionID = collectionID;
    }

    getCollectionName() {
        return this.#collectionName;
    }

    setCollectionName(collectionName) {
        this.#collectionName = collectionName;
    }

    getAmount() {
        return this.#amount;
    }

    setAmount(amount) {
        this.#amount = amount;
    }

    getTreasuryAllocation() {
        return this.#treasuryAllocation;
    }

    setTreasuryAllocation(treasuryAllocation) {
        this.#treasuryAllocation = treasuryAllocation;
    }

    getDividedAmount() {
        return this.#dividedAmount;
    }

    calculateDividedAmount() {
        this.#dividedAmount = this.#amount - this.#treasuryAllocation - this.#manualAssigned
    }

    getDescription() {
        return this.#description;
    }

    setDescription(description) {
        this.#description = description;
    }

    getPublishedDate() {
        return this.#publishedDate;
    }

    setPublishedDate(publishedDate) {
        this.#publishedDate = publishedDate;
    }

    getDeadline() {
        return this.#deadline;
    }

    setDeadline(deadline) {
        this.#deadline = deadline;
    }


}

module.exports = Collection