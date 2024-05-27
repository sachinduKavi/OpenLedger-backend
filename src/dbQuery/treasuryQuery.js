const conn = require('../SQL_Connection')
const Treasury = require('../DataModels/Treasury')

const fetchTreasuryParticipants = async (userID) => {
    // Fetch all the data form the database related to a particular user
    const [treasuryResults] = await conn.promise().query('SELECT treasury.treasury_ID, treasury_name, description, member_limit, treasury_link, global_visibility, public_group, current_balance, created_date, role, image_ref.link FROM treasury INNER JOIN treasury_participants ON treasury.treasury_ID = treasury_participants.treasury_ID INNER JOIN user ON treasury_participants.user_ID = user.user_ID INNER JOIN image_ref ON treasury.cover_img = image_ref.image_id WHERE user.user_ID = ? ORDER BY treasury.treasury_ID DESC', userID)
    // Creating object array for the treasury
    let treasuryObjectArray = new Array()
    for(let i = 0; i < treasuryResults.length; i++) {
        treasuryObjectArray[i] = new Treasury({
            treasuryID: treasuryResults[i]['treasury_ID'],
            treasuryName: treasuryResults[i]['treasury_name'],
            description: treasuryResults[i]['description'],
            memberLimit: treasuryResults[i]['member_limit'],
            treasuryLink: treasuryResults[i]['treasury_link'],
            globalVisibility: treasuryResults[i]['global_visibility'],
            publicTreasury: treasuryResults[i]['public_group'],
            currentBalance: treasuryResults[i]['current_balance'],
            createdDate: treasuryResults[i]['created_date'],
            userRole: treasuryResults[i]['role'],
            coverImageID: treasuryResults[i]['link'],
        })
    }

    return treasuryObjectArray
}

// Check data base for user ID and treasury ID both present in the database
// If present returns the users role in the group
const checkUserTreasury = async (userID, treasuryID) => {
    const [participantResult] = await conn.promise().query('SELECT role FROM treasury_participants WHERE treasury_ID = ? AND user_ID = ?', 
    [treasuryID, userID])
    //  Return the user role in the treasury
    return [(participantResult.length > 0), (participantResult.length > 0)?participantResult[0]['role']: null]
} 

module.exports = {
    fetchTreasuryParticipants,
    checkUserTreasury
}