const { sqlToStringDate } = require("../middleware/format")
const { getAnnouncementID } = require("../middleware/generateID")
const conn = require('../SQL_Connection')


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
  #publisherDP

  constructor({
    announcementID = 'AUTO',
    publishDate = null,
    treasuryID = null,
    publisherID = null,
    publisherName = null,
    caption = null,
    imageLink = null,
    commentArray = [],
    likeCount = null,
    publisherDP = null
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
    this.#publisherDP = publisherDP
  }


  // Creating new announcement record
  async saveAnnouncement() {
    if(this.#announcementID === 'AUTO') {
        // New announcement to publish 
        this.#announcementID = await getAnnouncementID()

        await conn.promise().query('INSERT INTO announcement (announcement_ID, published_date, treasury_ID, publisher_ID, caption, image_Link) VALUES (?, ?, ?, ?, ?, ?)',
            [this.#announcementID, this.#publishDate, this.#treasuryID, this.#publisherID, this.#caption, this.#imageLink]
        )

    }
  }

  // Delete announcement record from the database
  async deleteAnnouncement() {
    // Delete all the comments related to the announcement
    await conn.promise().query('DELETE FROM comments WHERE record_ID = ?', 
      [this.#announcementID]
    )

    await conn.promise().query('DELETE FROM post_like WHERE announcement_ID = ?',
      [this.#announcementID]
    )

    // Deleting announcement records 
    await conn.promise().query('DELETE FROM announcement WHERE announcement_ID = ?',
      [this.#announcementID]
    )

    
  }


  // Adding like or removing like from the post
  async togglePostLike(userID) {
    // Check whether user has already liked
    const [likeList] = await conn.promise().query('SELECT * FROM post_like WHERE announcement_ID = ? AND user_ID = ?',
      [this.#announcementID, userID]
    )

    let userLike = 'error'
    if(likeList.length > 0) {
      // User has already like the post 
      // Remove the like
      await conn.promise().query('DELETE FROM post_like WHERE announcement_ID = ? AND user_ID = ?',
        [this.#announcementID, userID]
      )
      userLike = "unlike"
    } else {
      // Add new like to the post
      await conn.promise().query('INSERT INTO post_like (announcement_ID, user_ID) VALUES (?, ?)',
        [this.#announcementID, userID]
      )
      userLike = 'like'
    }

    return userLike
  }


  // Count number of likes and comments for certain announcement and return 
  async countParameters(userID) {
    const [likeCount] = await conn.promise().query('SELECT COUNT(announcement_ID) AS count FROM post_like WHERE announcement_ID = ?',
    [this.#announcementID]
    )

    const [commentCount] = await conn.promise().query('SELECT COUNT(comment_ID) AS count FROM comments WHERE record_ID = ?',
      [this.#announcementID]
    )

    let myLike = false
    if(likeCount[0].count > 0) {
      const [myResult] = await conn.promise().query('SELECT * FROM post_like WHERE announcement_ID = ? AND user_ID = ?',
        [this.#announcementID, userID]
      )

      myLike = myResult.length > 0
    }

    return {
      likeCount: likeCount[0].count,
      commentCount: commentCount[0].count,
      myLike: myLike
    }
  }


  // Fetching all the announcements related to treasuryID
  static async fetchAllAnnouncements(treasuryID) {
    const [annResults] = await conn.promise().query('SELECT announcement_ID, CONVERT_TZ(published_date, "+00:00", "+05:30") AS published_date, user_name, publisher_ID, caption, image_link, link FROM announcement JOIN user ON user.user_ID = announcement.publisher_ID LEFT JOIN image_ref ON user.display_picture = image_ref.image_Id WHERE treasury_ID = ? ORDER BY announcement_ID DESC',
        [treasuryID]
    )

    let announcementList = []
    // Creating announcement instances for each record 
    annResults.forEach(element => {
        announcementList.push(new Announcement({
            announcementID: element.announcement_ID,
            publishDate: sqlToStringDate(element.published_date),
            publisherName: element.user_name,
            publisherID: element.publisher_ID,
            caption: element.caption,
            imageLink: element.image_link,
            publisherDP: element.link
        }))
    })

    return announcementList
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
      publisherDP: this.#publisherDP,
      publisherID: this.#publisherID
    }
  }
}

module.exports = Announcement
