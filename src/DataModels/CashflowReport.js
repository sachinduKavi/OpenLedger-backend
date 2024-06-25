const {getCashflowReportID} = require('../middleware/generateID')
const conn = require('../SQL_Connection')
const {sqlToStringDate} = require('../middleware/format')

class CashflowReportModel {
    #reportID 
    #treasuryID
    #insuranceDate
    #publisher
    #documentType
    #rangeStart
    #rangeEnd
    #incomeArray
    #expenseArray
    #status
    #signatureArray

    constructor({reportID = 'AUTO', treasuryID = null, insuranceDate = null, documentType = null, rangeStart = null, rangeEnd = null, incomeArray = [], status = 'DETAILED', expenseArray = [], publisher, signatureArray = []}) {
        this.#reportID = reportID,
        this.#treasuryID = treasuryID,
        this.#insuranceDate = insuranceDate
        this.#documentType = documentType
        this.#rangeStart = rangeStart
        this.#publisher = publisher
        this.#rangeEnd = rangeEnd
        this.#incomeArray = incomeArray
        this.#expenseArray = expenseArray
        this.#status = status
        this.#signatureArray = signatureArray
        // if (this.#incomeArray.length > 0 && !isClassObject(this.#incomeArray[0])) this.#convertToLedgerEvidenceIncome()
        // if (this.#expenseArray.length > 0 && !isClassObject(this.#expenseArray[0])) this.#convertToLedgerEvidenceExpense()
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
            publisher: this.#publisher,
            incomeArray: this.#incomeArray,
            expenseArray: this.#expenseArray,
            signatureArray: this.#signatureArray
        }
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
            await conn.promise().query('UPDATE cashflow_report SET publisher_ID = ?, document_type = ?, published_date = ?, range_s = ?, range_e = ?, status = ? WHERE cashflow_reportID = ?', 
                [publisherID, this.#documentType, this.#insuranceDate, this.#rangeStart, this.#rangeEnd, this.#status, this.#reportID]
            )
            // Remove signatures from the database
            await conn.promise().query('DELETE FROM report_signature WHERE report_ID = ?', [this.#reportID])
        }

        // Insert new signature array
        for(const signature of this.#signatureArray)
            await conn.promise().query('INSERT INTO report_signature (report_ID, signature) VALUES (?, ?)', [this.#reportID, signature])
        
        await this.updateCashflowValues()
            
        await this.getCashflowLedgerRecords(treasuryID)
        
    }

    // Update cashflow object 
    async updateCashflowValues() {
        // Update record data from the database
        const [cashflowResults] = await conn.promise().query('SELECT treasury_ID, document_type, CONVERT_TZ(published_date, "+00:00", "+05:30") AS published_date, CONVERT_TZ(range_e, "+00:00", "+05:30") AS range_e, CONVERT_TZ(range_s, "+00:00", "+05:30") AS range_s, status, user_name FROM cashflow_report JOIN user ON user.user_ID = cashflow_report.publisher_ID WHERE cashflow_reportID = ? LIMIT 1',
            [this.#reportID]
        )
        
        
        this.#treasuryID = cashflowResults[0]['treasury_ID']
        this.#documentType = cashflowResults[0]['document_type']
        this.#insuranceDate = sqlToStringDate(cashflowResults[0]['published_date'])
        this.#rangeStart = sqlToStringDate(cashflowResults[0]['range_s'])
        this.#rangeEnd = sqlToStringDate(cashflowResults[0]['range_e'])
        this.#status = cashflowResults[0]['status']
        this.#publisher = cashflowResults[0]['user_name']
    }


    // Get values from the ledger according to the cashflow record
    async getCashflowLedgerRecords(treasuryID) {
        // Fetch records from the ledger records
        const [ledgerRecord] = await conn.promise().query('SELECT record_ID, title, amount, created_date, category, name FROM ledger LEFT JOIN ledger_category ON ledger_category.category_ID = ledger.category WHERE created_date BETWEEN ? AND ? AND treasury_ID = ? ORDER BY category_ID DESC', 
            [this.#rangeStart, this.#rangeEnd, treasuryID]
        )

        this.#expenseArray = {}
        this.#incomeArray = {}// Reset values
        let preIncomeCat = 'null', preExpCat = 'null'
        let expenseCat = []
        let incomeCat = []
        // Incrementing values to expenseArray in incomeArray
        ledgerRecord.forEach(element => {
            if(element.amount >= 0) {
                // Positive value
                if(preIncomeCat !== 'null' && element.category !== preIncomeCat) {
                    incomeCat = []
                }

                incomeCat.push({
                    recordID: element.record_ID,
                    title: element.title,
                    amount: element.amount,
                    createdDate: sqlToStringDate(element.created_date),
                    categoryName: element.name,
                    categoryID: element.category
                })

                this.#incomeArray[element.name?.replace(' ', '_')??'Other'] = incomeCat

                preIncomeCat = element.category
                
            } else {
                // Negative value
                if(preExpCat !== 'null' && element.category !== preExpCat) {
                    expenseCat = []
                } else {

                }

                expenseCat.push({
                    recordID: element.record_ID,
                    title: element.title,
                    amount: element.amount,
                    createdDate: sqlToStringDate(element.created_date),
                    categoryName: element.name,
                    categoryID: element.category
                })

                this.#expenseArray[element.name?.replace(' ', '_')??'Other'] = expenseCat

                preExpCat = element.category
            }
        })

        
    }


    static async loadAllCashflowReports(treasuryID) {
        const [cashflowList] = await conn.promise().query('SELECT cashflow_reportID, user_name, document_type, CONVERT_TZ(published_date, "+00:00", "+05:30") AS published_date, CONVERT_TZ(range_s, "+00:00", "+05:30") AS range_s, CONVERT_TZ(range_e, "+00:00", "+05:30") AS range_e, status FROM cashflow_report JOIN user ON user.user_ID = cashflow_report.publisher_ID WHERE cashflow_report.treasury_ID = ?', [treasuryID])
        // Converting db results to cashflow instant
        return cashflowList.map(element => {
            return new CashflowReportModel({
                reportID: element.cashflow_reportID,
                publisher: element.user_name,
                documentType: element.document_type,
                insuranceDate: sqlToStringDate(element.published_date),
                rangeStart: sqlToStringDate(element.range_s),
                rangeEnd: sqlToStringDate(element.range_e),
                status: element.status
            })
        })
    }


    // Getters and Setters
    getSignatureArray() {
        return this.#signatureArray
    }

    setSignatureArray(signatureArray) {
        this.#signatureArray = signatureArray
    }


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