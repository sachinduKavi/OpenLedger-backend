const conn = require('../SQL_Connection')
const {getCollectionID} = require('../middleware/generateID')

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
    participantArray
    #manualAssigned

    static autoAssignCount = 0

    constructor({collectionID = 'AUTO', collectionName = null, amount = 0, treasuryAllocation = 0, description = null, publishedDate = null, deadline = null, participantArray = [], manualAssigned = 0, publisher = null, status = 'DRAFT'}) {
        this.#collectionID = collectionID
        this.#collectionName = collectionName
        this.#amount = amount
        this.#treasuryAllocation = treasuryAllocation
        this.#dividedAmount = amount - treasuryAllocation - manualAssigned
        this.#description = description
        this.#publishedDate = publishedDate
        this.#deadline = deadline
        this.#status = status
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
            
        } else {
            // Update existing record
        }


        // Creating collection participant records
        for(const element of this.participantArray) {
            await conn.promise().query('INSERT INTO collection_participant (collection_ID, user_ID, amount, paid_state, last_update, auto_assigned) VALUES(?, ?, ?, ?, ?, ?)', 
                [this.#collectionID, element.userID, element.amount, element.state, element.lastUpdate, element.autoAssigned]
            )
        }
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
        console.log('from class', this.#manualAssigned)
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