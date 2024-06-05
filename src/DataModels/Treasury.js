const conn = require('../SQL_Connection')

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
