// parse cookies function is responsible for extracting cookies from the header 
// of the client request
function parseCookies(request) {
    let cookie = {}
    const cookieHeader = request.headers.cookie
    if(cookieHeader) {
        cookieHeader.split(';').forEach(element => {
            const [tokenName, value] = element.split('=')
            cookie[tokenName] = value
        })
    }

    return cookie
}

module.exports = {
    parseCookies
}