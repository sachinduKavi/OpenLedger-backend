const conn = require('../SQL_Connection')
const {getExpenseID} = require('../middleware/generateID')

class Expense {
    #expenseID
    #itemOfWork
    #quantity
    #unit
    #rate

    constructor({itemOfWork = '',  quantity = '', unit = null, rate = null, expenseID = null}) {
        this.#itemOfWork = itemOfWork
        this.#quantity = quantity
        this.#unit = unit
        this.#rate = rate
        this.#expenseID = expenseID
    }

    extractJSON() {
        return {
            itemOfWork: this.#itemOfWork,
            quantity: this.#quantity,
            rate: this.#rate,
            unit: this.#unit,
            expenseID: this.#expenseID
        }

    }

    calculateExpense() {
        return this.#quantity * this.#rate
    }

    // Delete all the expense related to estimation ID
    static async deleteExpenseArray(estimateID) {
         await conn.promise().query('DELETE FROM expense WHERE estimation_ID = ?', [estimateID])
    }

    // Update database with data
    async saveExpense(estimateID) {
        console.log('expense ID', this.#expenseID)
    
        if(this.#expenseID === null) this.#expenseID = await getExpenseID()
        // Create new record in the database
        await conn.promise().query('INSERT INTO expense(expense_ID, estimation_ID, quantity, unit, item, rate) VALUES(?, ?, ?, ?, ?, ?)',
                [this.#expenseID, estimateID, this.#quantity, this.#unit, this.#itemOfWork, this.#rate]
            )
    }

    // Getters and Setters
    getExpenseID() {
        return this.#expenseID
    }

    setExpenseID(expenseID) {
        this.#expenseID = expenseID
    }

    getItemOfWork() {
        return this.#itemOfWork
    }
    
    setItemOfWork(itemOfWork) {
        this.#itemOfWork = itemOfWork
    }
    
    getQuantity() {
        return this.#quantity
    }

    setQuantity(quantity) {
        this.#quantity = quantity
    }

    getUnit() {
        return this.#unit
    }

    setUnit(unit) {
        this.#unit = unit
    }

    getRate() {
        return this.#rate
    }

    setRate(rate) {
        this.#rate = rate
    }
}

module.exports = Expense