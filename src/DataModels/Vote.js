const conn = require('../SQL_Connection')
const { sqlToStringDate } = require('../middleware/format')
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

    // Fetching single vote 
    static async fetchOptionsAndUsers(votingID) {
        const [optionResults] = await conn.promise().query(`SELECT option_ID, option_name from poll_option WHERE voting_ID = ?`, [votingID])
        const optionArray = []
        for(const optionElements of optionResults) {
            const option ={
                optionID: optionElements.option_ID,
                answer: optionElements.option_name,
                selectedUsers: []  
            }
            const [selectedUser] = await conn.promise().query(`SELECT voter_ID, user_name FROM user_vote JOIN user ON user.user_Id = user_vote.voter_ID WHERE option_ID = ?`, [option.optionID])

            for(const selectUserElement of selectedUser) {
                option.selectedUsers.push({
                    userID: selectUserElement.voter_ID,
                    userName: selectUserElement.user_name
                })
            }

            optionArray.push(option)
        }

        return optionArray
    }

        
    // Fetch all the results related to treasury
    static async fetchVotes(treasuryID) {
        const [votesResult] = await conn.promise().query(`SELECT vote_ID, publisher_ID, treasury_ID, publish_date, title, multiple FROM vote WHERE treasury_ID = ? ORDER BY vote_ID DESC`, [treasuryID])
        
        const voteArray = []
        for(const voteElement of votesResult) {
            voteArray.push(new Vote({
                voteID: voteElement.vote_ID,
                publisherID: voteElement.publisher_ID,
                treasuryID: voteElement.treasury_ID,
                publishDate: sqlToStringDate(voteElement.publish_date),
                title: voteElement.title,
                multiple: voteElement.multiple,
                choices: await this.fetchOptionsAndUsers(voteElement.vote_ID)
            }))
        }

        return voteArray
    }

    // Creating new voting poll
    async createPoll() {
        if(this.#voteID === null) {
            this.#voteID = await createID('vote', 'vote_ID', 'VT00')
        }

        await conn.promise().query(`INSERT INTO vote(vote_ID, publisher_ID, treasury_ID, publish_date, title, multiple) VALUES (?, ?, ?, ?, ?, ?)` , [
            this.#voteID, this.#publisherID, this.#treasuryID, this.#publishDate, this.#title, this.#multiple
        ])

        for(const option of this.#choices) {
            const optionID = await createID('poll_option', 'option_ID', 'OT00')
            await conn.promise().query(`INSERT INTO poll_option(option_ID, voting_ID, option_name) VALUES(?, ?, ?)`, [
                optionID, this.#voteID, option.answer
            ])
        }
    }

    
    // Fetch single record
    async fetchSingleRecord() {
        const [voteRecord] = await conn.promise().query(`SELECT publisher_ID, publish_date, title, multiple FROM vote WHERE treasury_ID = ? AND vote_ID = ? LIMIT 1`, [
            this.#treasuryID, this.#voteID
        ])

        this.#publisherID = voteRecord[0].publisher_ID
        this.#publishDate = sqlToStringDate(voteRecord[0].publish_date)
        this.#title = voteRecord[0].title
        this.#multiple = voteRecord[0].multiple
        this.#choices = await Vote.fetchOptionsAndUsers(this.#voteID)
    }


    // Update poll 
    async updatePoll(optionID, status, multiple) {
        if(status) {
            // Add new record to user vote
            if(!multiple) {
                await conn.promise().query(`DELETE FROM user_vote WHERE option_ID IN (SELECT option_ID FROM poll_option WHERE voting_ID = ? AND voter_ID = ?)`, [this.#voteID, this.#publisherID])
            }

            await conn.promise().query(`INSERT INTO user_vote(option_ID, voter_ID) VALUES (?, ?)`, [optionID, this.#publisherID])
        } else {
            // Remove record from user vote
            await conn.promise().query(`DELETE FROM user_vote WHERE voter_ID = ? AND option_ID = ?`, [this.#publisherID, optionID])
        }

        await this.fetchSingleRecord()
    }


    // Delete and remove all the records of a poll
    async deletePoll() {
        // Deleting from user_vote
        await conn.promise().query(`DELETE FROM user_vote WHERE option_ID IN (SELECT option_ID FROM poll_option WHERE voting_ID = ?)`, [this.#voteID])

        // Delete from poll option
        await conn.promise().query(`DELETE FROM poll_option WHERE voting_ID = ?`, [this.#voteID])

        // Delete from vote 
        await conn.promise().query(`DELETE FROM vote WHERE vote_ID = ?` , [this.#voteID])
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
