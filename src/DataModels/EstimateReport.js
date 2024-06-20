const Expense = require('./Expense')
const {isClassObject} = require('../middleware/auth')
const conn = require('../SQL_Connection')
const {getEstimationID} = require('../middleware/generateID')

class EstimateReport {
    #estimationID
    #name
    #treasuryID
    #publisher
    #description
    #expenseArray
    #signatureArray
    #overseerages
    #status
    #insuranceDate


    constructor({name = null, description = null, expenseArray = [], signatureArray = [], estimationID = 'AUTO', overseerages = 0, insuranceDate = null, status = null}) {
        this.#name = name
        this.#description = description
        this.#expenseArray = expenseArray
        this.#signatureArray = signatureArray
        this.#estimationID = estimationID 
        this.#overseerages = overseerages
        this.#insuranceDate = insuranceDate
        this.#status = status
 

        if(this.#expenseArray.length > 0 && !isClassObject(this.#expenseArray[0])) this.#convertToExpenseObject()
    }

    #convertToExpenseObject() {
        this.#expenseArray = this.#expenseArray.map((element) => {
            return new Expense({itemOfWork: element.itemOfWork, quantity: element.quantity, unit: element.unit, rate: element.rate})
        })
    }

    extractJSON() {
        return {
            estimationID: this.#estimationID,
            name: this.#name,
            description: this.#description,
            overseerages: this.#overseerages,
            expenseArray:  this.#expenseArray.map((element) => {
                return element.extractJSON()
            }),
            signatureArray: this.#signatureArray,
            insuranceDate: this.#insuranceDate,
            status: this.#status
        }
    }


    // Create record if the record dose not present in the database
    // IF it in the database record will be updated with new data
    async saveEstimateReport(treasuryID, userID) {
        if(this.#estimationID === 'AUTO') {
            // New estimation record in database
            this.#estimationID = await getEstimationID()
            await conn.promise().query('INSERT INTO estimation(estimation_ID, treasury_ID, publisher_ID, subject, name, published_date, status) VALUES(?, ?, ?, ?, ?, ?, ?)',
                [this.#estimationID, treasuryID, userID, this.#description, this.#name, this.#insuranceDate, 'DRAFT']
            )

        } else {
            // Old record required to update data
            await conn.promise().query('UPDATE estimation SET publisher_ID = ?, subject = ?, name = ?, published_date = ?, status = ? WHERE estimation_ID = ?', 
                [userID, this.#description, this.#name, this.#insuranceDate, this.#status, this.#estimationID]
            )

        }

        // Trigger to update data in expense table
        for(const element of this.#expenseArray) {
            await element.saveExpense(this.#estimationID)
        }
    }


    // Getters and Setters

    getInsuranceDate() {
        return this.#insuranceDate
    }

    setInsuranceDate(insuranceDate) {
        this.#insuranceDate = insuranceDate
    }

    getOverseerages() {
        return this.#overseerages
    }

    setOverseerages(overseerages) {
        this.#overseerages = overseerages
    }

    getEstimationID() {
        return this.#estimationID
    }

    setEstimationID(estimationID) {
        this.#estimationID = estimationID
    }


    getName() {
        return this.#name;
    }

    setName(name) {
        this.#name = name;
    }

    getDescription() {
        return this.#description;
    }

    setDescription(description) {
        this.#description = description;
    }

    getExpenseArray() {
        return this.#expenseArray;
    }

    setExpenseArray(expenseArray) {
        this.#expenseArray = expenseArray;
        if (expenseArray.length > 0 && !isClassObject(expenseArray[0])) {
            this.#convertToExpenseObject();
        }
    }

    getSignatureArray() {
        return this.#signatureArray;
    }

    setSignatureArray(signatureArray) {
        this.#signatureArray = signatureArray;
    }

}

module.exports = EstimateReport