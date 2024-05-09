class Treasury {
    // Private Treasury variables
    #treasuryID
    #treasuryName
    #description
    #memberLimit
    #coverImageID
    #treasuryLink
    #qrImageID
    #globalVisibility
    #public
    #ownerID

    constructor() {
        console.log('Creating new Treasury instant...')
    }

    getTreasuryID() {
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

    getQrImageID() {
        return this.#qrImageID
    }

    getGlobalVisibility() {
        return this.#globalVisibility
    }

    getPublic() {
        return this.#public
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

    setTreasuryName(description) {
        this.#description = description
    }

    setTreasuryName(memberLimit) {
        this.#memberLimit = memberLimit
    }

    setTreasuryName(coverImageID) {
        this.#coverImageID = coverImageID
    }

    setTreasuryName(treasuryLink) {
        this.#treasuryLink = treasuryLink
    }

    setTreasuryName(qrImageID) {
        this.#qrImageID = qrImageID
    }

    setTreasuryName(globalVisibility) {
        this.#globalVisibility = globalVisibility
    }

    setTreasuryName(public) {
        this.#public = public
    }

    setTreasuryName(ownerID) {
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
    setAll(treasuryID, treasuryName, description, memberLimit, coverImageID, treasuryLink, qrImageID, globalVisibility, public, ownerID) {
        this.setTreasuryID(treasuryID)
        this.setTreasuryName(treasuryName)
        this.setDescription(description)
        this.setMemberLimit(memberLimit)
        this.setCoverImageID(coverImageID)
        this.setTreasuryLink(treasuryLink)
        this.setQrImageID(qrImageID)
        this.setGlobalVisibility(globalVisibility)
        this.setPublic(public)
        this.setOwnerID(ownerID)
    }

    
}

module.exports = Treasury
