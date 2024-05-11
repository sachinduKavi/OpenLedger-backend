class Treasury {
    // Private Treasury variables
    #treasuryID
    #treasuryName
    #description
    #memberLimit
    #coverImageID
    #treasuryLink
    #globalVisibility
    #publicTreasury
    #ownerID
    // Creating new instant with values 01
    constructor({treasuryID = null, treasuryName = null, description = null, memberLimit = null, coverImageID = null, treasuryLink = null, publicTreasury = null, ownerID = null, globalVisibility = null}) {
        console.log('Creating Treasury instant with values')
        this.#treasuryID = treasuryID
        this.#treasuryName = treasuryName
        this.#description = description
        this.#memberLimit = memberLimit
        this.#coverImageID = coverImageID
        this.#treasuryLink = treasuryLink
        this.#publicTreasury = publicTreasury
        this.#ownerID = ownerID
        this.#globalVisibility = globalVisibility
    }


    getTreasuryID() {
        console.log('No value')
        return this.#treasuryID
    }

    getTreasuryID(some) {
        console.log('value', some)
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

    getQrImageID() {
        return this.#qrImageID
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

    setQrImageID(qrImageID) {
        this.#qrImageID = qrImageID
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
