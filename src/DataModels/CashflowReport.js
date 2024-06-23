const LedgerRecord = require('./LedgerRecord')
const {getCashflowReportID} = require('../middleware/generateID')
const conn = require('../SQL_Connection')

class CashflowReportModel {
    #reportID 
    #treasuryID
    #insuranceDate
    #documentType
    #rangeStart
    #rangeEnd
    #incomeArray
    #expenseArray
    #status

    constructor({reportID = 'AUTO', treasuryID = null, insuranceDate = null, documentType = null, rangeStart = null, rangeEnd = null, incomeArray = [], status = null, expenseArray = []}) {
        this.#reportID = reportID,
        this.#treasuryID = treasuryID,
        this.#insuranceDate = insuranceDate
        this.#documentType = documentType
        this.#rangeStart = rangeStart
        this.#rangeEnd = rangeEnd
        this.#incomeArray = incomeArray
        this.#expenseArray = expenseArray
        this.#status = status

        if (this.#incomeArray.length > 0 && !isClassObject(this.#incomeArray[0])) this.#convertToLedgerEvidenceIncome()
        if (this.#expenseArray.length > 0 && !isClassObject(this.#expenseArray[0])) this.#convertToLedgerEvidenceExpense()
    }

    extractJSON() {
        return {
            reportID: this.#reportID,
            treasuryID:  this.#treasuryID,
            insuranceDate: this.#insuranceDate,
            documentType: this.#documentType,
            rangeStart: this.#rangeStart,
            rangeEnd: this.#rangeEnd,
            status: this.#status,
            incomeArray: this.#incomeArray.map(element => {
                return element.extractJSON()
            }),
            expenseArray: this.#expenseArray.map(element => {
                return element.extractJSON()
            })
        }
    }

    #convertToLedgerEvidenceIncome() {
        let tempObjectArray = []
        this.#incomeArray.forEach(element => {
            tempObjectArray.push(new LedgerRecord(element))
        });
        this.#incomeArray = tempObjectArray
    }

    #convertToLedgerEvidenceExpense() {
        let tempObjectArray = []
        this.#expenseArray.forEach(element => {
            tempObjectArray.push(new LedgerRecord(element))
        });
        this.#expenseArray = tempObjectArray
    }


    // Get values ledger records from the database
    async saveCashflowReport(publisherID, treasuryID) {
        // Check whether the record is new
        if (this.#reportID === 'AUTO') {
            this.#reportID = await getCashflowReportID() // Generate new cashflow ID

            await conn.promise().query('INSERT INTO cashflow_report (cashflow_reportID, publisher_ID, treasury_ID, document_type, published_date, range_s, range_e, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [this.#reportID, publisherID, treasuryID, this.#documentType, this.#insuranceDate, this.#rangeStart, this.#rangeEnd, 'DRAFT']
            )
        } else {
            // Update the cashflow record
            await conn.promise().query('UPDATE cashflow_reportID SET publisher_ID = ?, document_type = ?, published_date = ?, range_s = ?, range_e = ?, status = ?', 
                [publisherID, this.#documentType, this.#insuranceDate, this.#rangeStart, this.#rangeEnd, this.#status]
            )
        }

        // Fetch records from the ledger records
        const [ledgerRecord] = await conn.promise().query('SELECT record_ID, title, amount, created_date, category, name FROM ledger LEFT JOIN ledger_category ON ledger_category.category_ID = ledger.category WHERE created_date BETWEEN ? AND ? AND treasury_ID = ? ORDER BY category_ID', 
            [this.#rangeStart, this.#rangeEnd, treasuryID]
        )

        this.#expenseArray = []
        this.#incomeArray = [] // Reset values
        // Incrementing values to expenseArray in incomeArray
        ledgerRecord.forEach(element => {
            if(element.amount > 0) {
                // Positive value
                this.#incomeArray.push(new LedgerRecord({
                    recordID: element.record_ID,
                    title: element.title,
                    createdDate: element.created_date?.toString().slice(0, 10),
                    amount: element.amount,
                    category: element.category
                }))
            } else {
                // Negative value
                this.#expenseArray.push(new LedgerRecord({
                    recordID: element.record_ID,
                    title: element.title,
                    createdDate: element.created_date?.toString().slice(0, 10),
                    amount: element.amount,
                    category: element.category
                }))
            }
        })
        console.log(ledgerRecord)
    }


    // Getters and Setters
    getStatus() {
        return this.#status
    }

    setStatus(status) {
        this.#status = status
    }

    getIncomeArray() {
        return this.#incomeArray
    }

    setIncomeArray(incomeArray) {
        this.#incomeArray = incomeArray
    }

    getExpenseArray() {
        return this.#expenseArray
    }

    setExpenseArray(expenseArray) {
        this.#expenseArray = expenseArray
    }

    getReportID() {
        return this.#reportID
    }

    setReportID(reportID) {
        this.#reportID = reportID
    }

    getTreasuryID() {
        return this.#treasuryID
    }

    setTreasuryID(treasuryID) {
        this.#treasuryID = treasuryID
    }

    getInsuranceDate() {
        return this.#insuranceDate
    }

    setInsuranceDate(insuranceDate) {
        this.#insuranceDate = insuranceDate
    }

    getDocumentType() {
        return this.#documentType
    }

    setDocumentType(documentType) {
        this.#documentType = documentType
    }

    getRangeStart() {
        return this.#rangeStart
    }

    setRangeStart(rangeStart) {
        this.#rangeStart = rangeStart
    }

    getRangeEnd() {
        return this.#rangeEnd
    }

    setRangeEnd(rangeEnd) {
        this.#rangeEnd = rangeEnd
    }
}

module.exports = CashflowReportModel