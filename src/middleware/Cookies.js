// parse cookies function is responsible for extracting cookies from the header 
// of the client request
function parseCookies(request) {
    let list = {}
    const cookieHeader = request.headers.cookie
    if(cookieHeader) {
        cookieHeader.split(';').forEach(element => {
            const [tokenName, value] = element.split('=')
            list.tokenName = value
        })
    }

    return list
}

module.exports = {
    parseCookies
}