class Evidence {
    #imageLink
    #imageName
    #description
    #recordID

    constructor({imageLink = null, imageName = null, description = null, recordID = null}) {
        this.#imageLink = imageLink
        this.#imageName = imageName
        this.#description = description
        this.#recordID = recordID
    }


    // Convert evidence object to JSON
    extractJSON() {
        return {
            imageName: this.#imageName,
            imageLink: this.#imageLink,
            description: this.#description,
        }
    }

    // Getters and Setters of the evidence class
    getImageLink() {
        return this.#imageLink;
    }

    setImageLink(imageLink) {
        this.#imageLink = imageLink;
    }

    getImageName() {
        return this.#imageName;
    }

    setImageName(imageName) {
        this.#imageName = imageName;
    }

    getDescription() {
        return this.#description;
    }

    setDescription(description) {
        this.#description = description;
    }

    getRecordID() {
        return this.#recordID;
    }

    setRecordID(recordID) {
        this.#recordID = recordID;
    }
}


module.exports = Evidence