
class Announcement {
  #announcementID
  #publishDate
  #treasuryID
  #publisherID
  #publisherName
  #caption
  #imageLink
  #commentArray
  #likeCount

  constructor({
    announcementID = 'AUTO',
    publishDate = generateCurrentDate(),
    treasuryID = null,
    publisherID = null,
    publisherName = null,
    caption = null,
    imageLink = null,
    commentArray = [],
    likeCount = null
  }) {
    this.#announcementID = announcementID
    this.#publishDate = publishDate
    this.#treasuryID = treasuryID
    this.#publisherID = publisherID
    this.#publisherName = publisherName
    this.#caption = caption
    this.#imageLink = imageLink
    this.#commentArray = commentArray
    this.#likeCount = likeCount
  }

  // Getters
  getAnnouncementID() {
    return this.#announcementID
  }

  getPublishDate() {
    return this.#publishDate
  }

  getTreasuryID() {
    return this.#treasuryID
  }

  getPublisherID() {
    return this.#publisherID
  }

  getPublisherName() {
    return this.#publisherName
  }

  getCaption() {
    return this.#caption
  }

  getImageLink() {
    return this.#imageLink
  }

  getCommentArray() {
    return this.#commentArray
  }

  getLikeCount() {
    return this.#likeCount
  }

  // Setters
  setAnnouncementID(announcementID) {
    this.#announcementID = announcementID
  }

  setPublishDate(publishDate) {
    this.#publishDate = publishDate
  }

  setTreasuryID(treasuryID) {
    this.#treasuryID = treasuryID
  }

  setPublisherID(publisherID) {
    this.#publisherID = publisherID
  }

  setPublisherName(publisherName) {
    this.#publisherName = publisherName
  }

  setCaption(caption) {
    this.#caption = caption
  }

  setImageLink(imageLink) {
    this.#imageLink = imageLink
  }

  setCommentArray(commentArray) {
    this.#commentArray = commentArray
  }

  setLikeCount(likeCount) {
    this.#likeCount = likeCount
  }

  extractJSON() {
    return {
      announcementID: this.#announcementID,
      publishDate: this.#publishDate,
      treasuryID: this.#treasuryID,
      publisherName: this.#publisherName,
      caption: this.#caption,
      imageLink: this.#imageLink,
      commentArray: this.#commentArray,
      likeCount: this.#likeCount,
    }
  }
}

module.exports = Announcement
