const Expense = require('./Expense')
const {isClassObject} = require('../middleware/auth')
const conn = require('../SQL_Connection')
const {getEstimationID} = require('../middleware/generateID')
const {sqlToStringDate} = require('../middleware/format')

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


    constructor({name = null, description = null, expenseArray = [], signatureArray = [], estimationID = 'AUTO', overseerages = 0, insuranceDate = null, status = null, publisher = null}) {
        this.#name = name
        this.#description = description
        this.#expenseArray = expenseArray
        this.#signatureArray = signatureArray
        this.#estimationID = estimationID 
        this.#overseerages = overseerages
        this.#insuranceDate = insuranceDate
        this.#status = status
        this.#publisher = publisher
 

        if(this.#expenseArray.length > 0 && !isClassObject(this.#expenseArray[0])) this.#convertToExpenseObject()
    }

    #convertToExpenseObject() {
        this.#expenseArray = this.#expenseArray.map((element) => {
            return new Expense({itemOfWork: element.itemOfWork, quantity: element.quantity, unit: element.unit, rate: element.rate, expenseID: element.expenseID})
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
            status: this.#status,
            publisher: this.#publisher
        }
    }

    // Delete estimation record from the database
    async deleteEstimateRecord() {
        // Remove all the expenses related to the document
        await conn.promise().query('DELETE FROM expense WHERE estimation_ID = ?', [this.#estimationID])

        // Remove all the signatures assigned with the estimation
        await conn.promise().query('DELETE FROM report_signature WHERE report_ID = ?', [this.#estimationID])

        // Finally deleting estimation record
        await conn.promise().query('DELETE FROM estimation WHERE estimation_ID = ?', [this.#estimationID])
    }


    // Fetch all the estimation record related to treasuryID
    static async fetchAllEstimation(treasuryID) {
        const [estimationResult] = await conn.promise().query('SELECT estimation.estimation_ID, user.user_name, subject, name, published_date, status, report_signature.signature, expense_ID, quantity, overseerages, unit, item, rate FROM estimation LEFT JOIN user ON estimation.publisher_ID = user.user_ID LEFT JOIN expense ON estimation.estimation_ID = expense.estimation_ID LEFT JOIN report_signature ON estimation.estimation_ID = report_ID WHERE treasury_ID = ? ORDER BY estimation.estimation_ID DESC',
            [treasuryID]
        )

        // Converting sql query to JSON format dam it 
        let preEstimationID = null
        let estimateList = []
        let expenseList = []
        let signatureList = []
        for(const element of estimationResult) {
            if(signatureList.length > 0 && element.signature !== null && signatureList[signatureList.length - 1] !== element.signature)
                signatureList.push(element.signature)

            if(preEstimationID !== null && element.estimation_ID === preEstimationID) {
                // Update the previous record
                expenseList.push(new Expense({
                    expenseID: element.expense_ID,
                    quantity: element.quantity,
                    unit: element.unit,
                    itemOfWork: element.item,
                    rate: element.rate
                }))
                estimateList[estimateList.length - 1].setExpenseArray(expenseList)
                estimateList[estimateList.length - 1].setSignatureArray(signatureList)
            } else {
                // New estimation record 
                expenseList = [] // Reset array variables
                signatureList = []
                if(element.signature !== null)
                    signatureList.push(element.signature)
                expenseList.push(new Expense({
                    expenseID: element.expense_ID,
                    quantity: element.quantity,
                    unit: element.unit,
                    itemOfWork: element.item,
                    rate: element.rate
                }))
                estimateList.push(new EstimateReport({
                    estimationID: element.estimation_ID,
                    publisher: element.user_name,
                    description: element.subject,
                    name: element.name,
                    insuranceDate: sqlToStringDate(element.published_date),
                    overseerages: element.overseerages,
                    status: element.status,
                    expenseArray: expenseList,
                    signatureArray: signatureList
                }))
            }
            
            preEstimationID = element.estimation_ID
            
        }

        return estimateList
    }


    // Create record if the record dose not present in the database
    // IF it in the database record will be updated with new data
    async saveEstimateReport(treasuryID, userID) {
        console.log('estimation ID', this.#estimationID)
        if(this.#estimationID === 'AUTO') {
            // New estimation record in database
            this.#estimationID = await getEstimationID()
            await conn.promise().query('INSERT INTO estimation(estimation_ID, treasury_ID, publisher_ID, subject, name, published_date, status, overseerages) VALUES(?, ?, ?, ?, ?, ?, ?, ?)',
                [this.#estimationID, treasuryID, userID, this.#description, this.#name, this.#insuranceDate, 'DRAFT', this.#overseerages]
            )
            console.log('create')

        } else {
            // Old record required to update data
            const [update] = await conn.promise().query('UPDATE estimation SET publisher_ID = ?, subject = ?, name = ?, published_date = ?, status = ?, overseerages = ? WHERE estimation_ID = ?', 
                [userID, this.#description, this.#name, this.#insuranceDate, this.#status, this.#overseerages, this.#estimationID]
            )
            console.log('updated values', update)
            // Removing previously added expense records 
            await Expense.deleteExpenseArray(this.#estimationID)
        }

        // Trigger to update data in expense table
        for(const element of this.#expenseArray) {
            await element.saveExpense(this.#estimationID)
        }

        // Delete all the signatures related to estimation ID
        await conn.promise().query('DELETE FROM report_signature WHERE report_ID = ?', [this.#estimationID])
        // Insert New signature array
        for(const signature of this.#signatureArray) {
            await conn.promise().query('INSERT INTO report_signature(report_ID, signature) VALUES(?, ?)', [this.#estimationID, signature])
        }

        return this.#estimationID // Return the newly generated estimation ID to front end
    }


    // Getters and Setters
    getExpenseArray() {
        return this.#expenseArray
    }

    getPublisher() {
        return this.#publisher
    }

    setPublisher(publisher) {
        this.#publisher = publisher
    }

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