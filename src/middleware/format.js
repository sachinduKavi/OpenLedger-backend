const sqlTOJson = (arrayObject) => {

}

const sqlToStringDate = () => {
    // Create a Date object from the ISO string
    const date = new Date("2024-06-19T18:30:00.000Z")

    // Extract the year, month, and day
    const year = date.getUTCFullYear()
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0') // Months are zero-indexed
    const day = date.getUTCDate().toString().padStart(2, '0')

    // Format the date as YYYY-MM-DD
    const formattedDate = `${year}-${month}-${day}`

    return formattedDate // Output: 2024-06-19
}

module.exports = {
    sqlToStringDate
}