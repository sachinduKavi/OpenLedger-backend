const conn = require('../SQL_Connection')
const Evidence = require('./Evidence')
const {createID} = require('../middleware/generateID')

class Complaint {
    #complaintID
    #publishedDate
    #treasuryID
    #publisherID
    #anonymous
    #caption
    #subject
    #status
    #evidenceArray
    #evidenceLinkArray

    constructor({complaintID = null, publishedDate = null, treasuryID = null, publisherID = null, anonymous = true, caption = null, subject = null, status = null, evidenceArray = [], evidenceLinkArray = []}) {
        this.#complaintID = complaintID
        this.#publishedDate = publishedDate
        this.#treasuryID = treasuryID
        this.#publisherID = publisherID
        this.#anonymous = anonymous
        this.#caption = caption
        this.#subject = subject
        this.#status = status
        this.#evidenceLinkArray = evidenceLinkArray
        this.#evidenceArray = evidenceArray
    }

    // create new complaint 
    async createComplaint() {
        if(this.#complaintID === null) this.#complaintID = await createID('complaint', 'complaint_ID', 'CO00')
            this.#status = "UNSOLVED"
            // Updating the complaint table
        await conn.promise().query(`INSERT INTO complaint (complaint_ID, published_date, treasury_ID, publisher_ID, anonymous, caption, subject, status) VALUES(?, ?, ?, ?, ?, ?, ?, ?)`, [
            this.#complaintID, this.#publishedDate, this.#treasuryID, this.#publisherID, this.#anonymous, this.#caption, this.#subject, this.#status
        ])

        // Updating evidence 
        for(const element of this.#evidenceLinkArray) {
            const evidence = new Evidence({imageLink: element.link, description: element.description, recordID: this.#complaintID})
            await evidence.createEvidence(this.#complaintID)
        }
        
    }


    extractJSON() {
        return {
            complaintID: this.#complaintID,
            publishedDate: this.#publishedDate,
            treasuryID: this.#treasuryID,
            publisherID: this.#publisherID,
            anonymous: this.#anonymous,
            caption: this.#caption,
            subject: this.#subject,
            status: this.#status,
            evidenceLinkArray: this.#evidenceLinkArray
        }
    }



    // Getters
    getEvidenceArray() {
        return this.#evidenceArray
    }


    getComplaintID() {
        return this.#complaintID;
    }

    getPublishedDate() {
        return this.#publishedDate;
    }

    getTreasuryID() {
        return this.#treasuryID;
    }

    getPublisherID() {
        return this.#publisherID;
    }

    getAnonymous() {
        return this.#anonymous;
    }

    getCaption() {
        return this.#caption;
    }

    getSubject() {
        return this.#subject;
    }

    getStatus() {
        return this.#status;
    }

    // Setters
    setEvidenceArray(evidenceArray) {
        this.#evidenceArray = evidenceArray
    }


    setComplaintID(complaintID) {
        this.#complaintID = complaintID;
    }

    setPublishedDate(publishedDate) {
        this.#publishedDate = publishedDate;
    }

    setTreasuryID(treasuryID) {
        this.#treasuryID = treasuryID;
    }

    setPublisherID(publisherID) {
        this.#publisherID = publisherID;
    }

    setAnonymous(anonymous) {
        this.#anonymous = anonymous;
    }

    setCaption(caption) {
        this.#caption = caption;
    }

    setSubject(subject) {
        this.#subject = subject;
    }

    setStatus(status) {
        this.#status = status;
    }



}


module.exports = Complaint