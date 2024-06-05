const conn = require('../SQL_Connection')
const {getEvidenceID} = require('../middleware/generateID')
const ImageRef = require('./ImageRef')
class Evidence {
    #evidenceID
    #imageLink
    #imageName
    #description
    #recordID

    constructor({imageLink = null, imageName = null, description = null, recordID = null, evidenceID = null}) {
        this.#imageLink = imageLink
        this.#imageName = imageName
        this.#description = description
        this.#recordID = recordID
        this.#evidenceID = evidenceID
    }


    // Convert evidence object to JSON
    extractJSON() {
        return {
            description: this.#description,
            imageName: this.#imageName,
            imageLink: this.#imageLink,
            description: this.#description,
        }
    }


    // Fetch all the evidence related to the recordID
    static async fetchAllEvidence(recordID) {
        console.log('Record ID' ,recordID)
        let evidenceArray = [] // Empty evidence array
        const [evidenceResults] = await conn.promise().query('SELECT evidence_ID, description, link FROM evidence_image WHERE record_ID = ?', [recordID])

        for(let element of evidenceResults) {
            evidenceArray.push(new Evidence({
                recordID: recordID,
                evidenceID: element.evidence_ID,
                imageLink: element.link,
                description: element.description
            }))
            console.log(element.link)
        }

        // console.log('evidence Array',evidenceArray[0].getImageLink())
        return evidenceArray
    }


    // Creating evidence record in the database
    async createEvidence(recordID) {
        // Generate new Evidence ID
        if(this.#evidenceID === null) this.#evidenceID = await getEvidenceID() 

        const image = new ImageRef({link: this.#imageLink}) // ImageRef object 
        const imageID = await image.updateDatabase() // Create image link record

        const [result] = await conn.promise().query('INSERT INTO evidence (evidence_ID, record_ID, description, image) VALUES (?, ?, ?, ?)',
        [this.#evidenceID, recordID, this.#description, imageID])
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