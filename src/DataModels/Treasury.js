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

    setTreasuryID(treasuryID) {
        this.#treasuryID = treasuryID
    }
}

module.exports = Treasury