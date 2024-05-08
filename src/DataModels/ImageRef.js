const conn = require('../SQL_Connection')

class ImageRef {
    #imageID = null
    #xAxis = null
    #yAxis = null
    #scale = null
    #link = null


    constructor() {
        console.log('Creating new Image instant with value assigned')
    }

    // Update the sql database with current values in the instant
    async updateDatabase() {
        const [imageResult] = await conn.promise().query('INSERT INTO image_ref(image_id, x_axis, y_axis, scale, link) VALUES(?, ?, ?, ?, ?)',
    [this.#imageID, this.#xAxis, this.#yAxis, this.#scale, this.#link])
    }

    setImageId(imageId) {
        this.#imageID = imageId
    }

    setXaxis(xAxis) {
        this.#xAxis = xAxis
    }

    setYaxis(yAxis) {
        this.#yAxis = yAxis    
    }

    setScale(scale) {
        this.#scale = scale
    }

    setLink(link) {
        this.#link = link
    }
    
    getImageId() {
        return this.#imageID
    }

    getXaxis() {
        return this.#xAxis
    }

    getYaxis() {
        return this.#yAxis
    }

    getScale() {
        return this.#scale
    }

    getLink() {
        return this.#link
    }

    getAll(){
        return[
            this.getImageId(),
            this.getLink(),
            this.getScale(),
            this.getXaxis(),
            this.getYaxis(),       
        ]
    }

    setAll(imageId, xAxis, yAxis, scale, link) {
        this.setImageId(imageId)
        this.setLink(link)
        this.setScale(scale)
        this.setXaxis(xAxis)
        this.setYaxis(yAxis)
    }
}


module.exports = ImageRef