const http = require('http')


const sever = http.createServer()





sever.listen(3000, ()=> {
    console.log("Server running on port 3000")
})