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

    // Update database with data
    async saveExpense(estimateID) {
        if(this.#expenseID === null) {
            // Create new record in the database
            this.#expenseID = await getExpenseID()
            await conn.promise().query('INSERT INTO expense(expense_ID, estimation_ID, quantity, unit, item, rate) VALUES(?, ?, ?, ?, ?, ?)',
                [this.#expenseID, estimateID, this.#quantity, this.#unit, this.#itemOfWork, this.#rate]
            )
        } else {
            // Record exist in database update it values
            await conn.promise().query('UPDATE expense SET quantity = ?, unit = ?, item = ?, rate = ?',
                [this.#quantity, this.#unit, this.#itemOfWork, this.#rate, this.#expenseID]
            )
        }
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