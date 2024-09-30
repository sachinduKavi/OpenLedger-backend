const conn = require('../SQL_Connection')
const {userCategorize} = require('../middleware/auth')
const User = require('../DataModels/User')

class Treasury {
    // Private Treasury variables
    #treasuryID
    #treasuryName
    #description
    #memberLimit
    #createdDate
    #coverImageID
    #treasuryLink
    #globalVisibility
    #publicTreasury
    #ownerID
    #currentBalance
    #userRole

    // Creating new instant with values 01
    constructor({treasuryID = null, treasuryName = null, description = null, memberLimit = null, coverImageID = null, treasuryLink = null, publicTreasury = null, ownerID = null, globalVisibility = null, createdDate = null, currentBalance = null, userRole = null}) {
        this.#treasuryID = treasuryID
        this.#treasuryName = treasuryName
        this.#description = description
        this.#memberLimit = memberLimit
        this.#coverImageID = coverImageID
        this.#createdDate = createdDate?.toString().slice(0, 10)?? null
        this.#treasuryLink = treasuryLink
        this.#publicTreasury = publicTreasury
        this.#ownerID = ownerID
        this.#globalVisibility = globalVisibility
        this.#currentBalance = currentBalance
        this.#userRole = userRole
    }

    // Fill the fields with the data in the database
    // Fetch values and update the instant from database ....
    async fetchFromDatabase() {
        const [results] = await conn.promise().query('SELECT treasury_name, description, member_limit, link, treasury_link, global_visibility, public_group, current_balance, created_date FROM treasury JOIN image_ref ON treasury.cover_img = image_ref.image_id WHERE treasury_ID = ? LIMIT 1', [this.#treasuryID])
        
        const treasuryResults = results[0]
        // Set instant values
        this.#treasuryName = treasuryResults['treasury_name']
        this.#description = treasuryResults['description']
        this.#memberLimit = treasuryResults['member_limit']
        this.#coverImageID = treasuryResults['link']
        this.#globalVisibility = treasuryResults['global_visibility']
        this.#publicTreasury = treasuryResults['public_group']
        this.#currentBalance = treasuryResults['current_balance']
        this.#createdDate = treasuryResults['created_date']
        this.#treasuryLink = treasuryResults['treasury_link']
    }

    extractJSON() {
        return {
            treasuryID: this.#treasuryID,
            treasuryName: this.#treasuryName,
            description: this.#description,
            memberLimit: this.#memberLimit,
            coverImageID: this.#coverImageID,
            createdDate: this.#createdDate,
            globalVisibility: this.#globalVisibility,
            treasuryLink: this.#treasuryLink,
            publicTreasury: this.#publicTreasury,
            ownerID: this.#ownerID,
            currentBalance: this.#currentBalance
        }
    }

    // Remove a request 
    async deleteRequest(requestID) {
        await conn.promise().query(`DELETE FROM member_request WHERE request_ID = ?`, [requestID])
    }

    // Load request in the treasury
    async loadRequest() {
        console.log(this.#treasuryID)
        const [requestResults] = await conn.promise().query(`SELECT request_ID, member_request.user_ID, user_name, user_email, link FROM member_request JOIN user ON member_request.user_ID = user.user_Id JOIN image_ref ON user.display_picture = image_ref.image_Id WHERE treasury_ID = ?`, [this.#treasuryID])
        return requestResults
    }



    // Accepts requests
    async acceptsRequest(requestID) {
        const [requestResults] = await conn.promise().query(`SELECT user_ID, treasury_ID FROM member_request WHERE request_ID =?`, [requestID])
        try {
            await conn.promise().query(`INSERT INTO treasury_participants (treasury_ID, user_ID, role) VALUES (?, ?, ?)`, [
                requestResults.treasury_ID, requestResults.user_ID, 'Member'
            ])
        } catch(e) {

        }

        await this.deleteRequest(requestID)
    }


    // Fetch all treasury participants from the database 
    // Assign them to relative objects 
    async getAllTreasuryParticipants() {
        const [participantsResult] = await conn.promise().query(`SELECT user_name, user.user_ID, link, user_email, mobile_number, about_me, x_axis, y_axis, scale,
        role FROM user JOIN treasury_participants ON user.user_ID = treasury_participants.user_ID LEFT JOIN image_ref
        ON user.display_picture = image_ref.image_id WHERE treasury_participants.treasury_ID = ?`, [this.#treasuryID])
        
        let objectArray = []
        participantsResult.forEach((participant) => {
            // Data is converted to standard format that object can read
            const temporaryParticipant = {
                userName: participant['user_name'],
                userID: participant['user_ID'],
                dpLink: participant['link'],
                userEmail: participant['user_email'],
                mobileNumber: participant['mobile_number'],
                aboutMe: participant['about_me'],
                pictureScale: {
                    x: participant['x_axis'],
                    y: participant['y_axis'],
                    scale: participant['scale'],
                }
            }
            // Categorize user into their roles 
            // Create an instant 
            const user = userCategorize(participant['role'], temporaryParticipant)
            objectArray.push(user) // Push the instant to the object array
        })

        return objectArray
    }


    // Update treasury balance query
    async updateTreasuryBalance(amount) {
        const [updateResult] = await conn.promise().query(`UPDATE treasury SET current_balance = current_balance + ? WHERE treasury_ID = ?`,
            [amount, this.#treasuryID]
        )

        return updateResult.affectedRows > 0
    }


    async updateDatabase() {
        console.log('created Date',this.#createdDate)
        // Update treasury database with all the current values
        await conn.promise().query(`INSERT INTO treasury (treasury_ID, treasury_name, description, member_limit, cover_img, treasury_link, global_visibility, public_group,created_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [this.#treasuryID, this.#treasuryName, this.#description, this.#memberLimit, this.#coverImageID, this.#treasuryLink, this.#globalVisibility, this.#publicTreasury, this.#createdDate])

        // Create treasury owner 
        await conn.promise().query(`INSERT INTO treasury_participants (treasury_ID, user_ID, role) VALUES (?, ?, ?)`,
        [this.#treasuryID, this.#ownerID, 'Treasurer'])
    }

    getTreasuryID() {
        console.log('No value')
        return this.#treasuryID
    }

    getTreasuryName() {
        return this.#treasuryName
    }

    getDescription() {
        return this.#description
    }

    getMemberLimit() {
        return this.#memberLimit
    }

    getCoverImageID() {
        return this.#coverImageID
    }

    getTreasuryLink() {
        return this.#treasuryLink
    }

    getGlobalVisibility() {
        return this.#globalVisibility
    }

    getPublic() {
        return this.#publicTreasury
    }

    getOwnerID() {
        return this.#ownerID
    }

    setTreasuryID(treasuryID) {
        this.#treasuryID = treasuryID
    }

    setTreasuryName(treasuryName) {
        this.#treasuryName = treasuryName
    }

    setDescription(description) {
        this.#description = description
    }

    setMemberLimit(memberLimit) {
        this.#memberLimit = memberLimit
    }

    setCoverImageID(coverImageID) {
        this.#coverImageID = coverImageID
    }

    setTreasuryLink(treasuryLink) {
        this.#treasuryLink = treasuryLink
    }

    setGlobalVisibility(globalVisibility) {
        this.#globalVisibility = globalVisibility
    }

    setPublicTreasury(publicTreasury) {
        this.#publicTreasury = publicTreasury
    }

    setOwnerID(ownerID) {
        this.#ownerID = ownerID
    }

    getAll() {
        return [
            this.getTreasuryID(),
            this.getTreasuryName(),
            this.getDescription(),
            this.getMemberLimit(),
            this.getCoverImageID(),
            this.getTreasuryLink(),
            this.getQrImageID(),
            this.getGlobalVisibility(),
            this.getPublic(),
            this.getOwnerID()
        ]
    }

    getAllTreasuryData() {
        return {
            treasury_ID: this.#treasuryID,
            treasury_name: this.#treasuryName,
            description: this.#description,
            member_limit: this.#memberLimit,
            treasury_link: this.#treasuryLink,
            global_visibility: this.#globalVisibility,
            public_treasury: this.#publicTreasury,
            current_balance: this.#currentBalance,
            created_date: this.#createdDate,
            user_role: this.#createdDate,
            cover_image_link: this.#coverImageID 
        }
    }

    setAll(treasuryID, treasuryName, description, memberLimit, coverImageID, treasuryLink, qrImageID, globalVisibility, publicTreasury, ownerID) {
        this.setTreasuryID(treasuryID)
        this.setTreasuryName(treasuryName)
        this.setDescription(description)
        this.setMemberLimit(memberLimit)
        this.setCoverImageID(coverImageID)
        this.setTreasuryLink(treasuryLink)
        this.setQrImageID(qrImageID)
        this.setGlobalVisibility(globalVisibility)
        this.setPublicTreasury(publicTreasury)
        this.setOwnerID(ownerID)
    }

    
}

module.exports = Treasury
