const conn = require('../SQL_Connection')
const {createID} = require('../middleware/generateID')

class Vote {
    #voteID
    #publisherID
    #publishDate
    #title
    #multiple
    #choices
    #treasuryID

    constructor({voteID = null, publisherID = null, publishDate = null, title = null, multiple = false, choices = [], treasuryID = null}) {
        this.#voteID = voteID
        this.#publisherID = publisherID
        this.#publishDate = publishDate
        this.#title = title
        this.#multiple = multiple
        this.#choices = choices
        this.#treasuryID = treasuryID
    }

    extractJSON() {
        return {
            voteID: this.#voteID,
            publisherID: this.#publisherID,
            publishDate: this.#publishDate,
            title: this.#title,
            multiple: this.#multiple,
            choices: this.#choices,
            treasuryID: this.#treasuryID
        }
    }


    // Creating new voting poll
    async createPoll() {
        if(this.#voteID === null) this.voteID = await createID('vote', 'vote_ID', 'VT00')
            console.log(this.#voteID)
        await conn.promise().query(`INSERT INTO vote(vote_ID, publisher_ID, treasury_ID, publish_date, title, multiple) VALUES (?, ?, ?, ?, ?, ?)` , [
            this.#voteID, this.#publisherID, this.#treasuryID, this.#publishDate, this.#title, this.#multiple
        ])
    }


    getTreasuryID() {
        return this.#treasuryID
    }

    setTreasuryID(treasuryID) {
        this.#treasuryID = treasuryID
    }


    getChoices() {
        return this.#choices
    }

    setChoices(choices) {
        this.#choices = choices
    }

    // Getter for voteID
    getVoteID() {
        return this.#voteID;
    }

    // Setter for voteID
    setVoteID(voteID) {
        this.#voteID = voteID;
    }

    // Getter for publisherID
    getPublisherID() {
        return this.#publisherID;
    }

    // Setter for publisherID
    setPublisherID(publisherID) {
        this.#publisherID = publisherID;
    }

    // Getter for publishDate
    getPublishDate() {
        return this.#publishDate;
    }

    // Setter for publishDate
    setPublishDate(publishDate) {
        this.#publishDate = publishDate;
    }

    // Getter for title
    getTitle() {
        return this.#title;
    }

    // Setter for title
    setTitle(title) {
        this.#title = title;
    }

    // Getter for multiple
    getMultiple() {
        return this.#multiple;
    }

    // Setter for multiple
    setMultiple(multiple) {
        this.#multiple = multiple;
    }
}


module.exports = Vote
