const http = require('http')

const corsOptions = {
    origin: 'http://localhost:3000',  // Replace with your React app origin
    credentials: true, // If sending cookies
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Custom-Header'] // Adjust as needed
  };

class Fleet {
    constructor() {
        this.fleetBundle = []
        this.breakLoop = false
    }

    

    async listen(PORT, func) {
        // Initiate the sever 
        this.server = http.createServer((req, res) => {
            // Access control
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

            // Display cors error in the console if it dose not have access
            if (req.method === 'OPTIONS') {
                res.writeHead(200, corsOptions)
                res.end()
                return
            }

              
            let count = 0
            for(let useCase of this.fleetBundle) {
                //Outer loop that iterate with use case objects
                for(let router of useCase.router.routeBundle) {
                    // Inside loop that iterate with route objects
                    if(req.url === `${useCase.usePath}${router.route}` && req.method === router.method) {
                        let dataBody = "" // Concatenate the req.body string
                        req.on('data', (chunk) => {
                            dataBody += chunk
                        })


                        req.on('end', () => {
                            // Creating request body
                            const request = {
                                body: JSON.parse(dataBody)
                            }
                            
                            res.writeHead(200, {'Content-Type': 'application/json'})
                            router.function(request, res) // Calling router function ...
                        })

                        
                        this.breakLoop = true
                        break // Break the inner loop when the request is satisfied 
                    }
                    count++;
                }
                // Break the outer loop when request is satisfied 
                if(this.breakLoop) {
                    this.breakLoop = false
                    break
                }
            }
        })

        this.server.listen(PORT, () => func())
        
    }
    
    use(usePath, route) {
        this.fleetBundle.push({
            usePath: usePath,
            router: route
        })
    }

}

module.exports = Fleet