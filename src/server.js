'use strict'
let http = require('http')
let server = http.createServer(function(req, res){
    res.writeHead(200, {'Content-Type': 'text/html'})
    console.log('request was made : ' + req.url)
    // res.writeHead(200, {'Content-Type': 'application/json'})
    // res.write('hello world')
    let obj = {
        name: "sindhu",
        school: "geek"
    }
    // res.write(req.url)
    // res.end()
    res.end(JSON.stringify(obj))
})
let port = 5432
// server.listen(port)
server.listen(port, (err) => {
    if (err) {
      throw Error('something bad happened', err)
    }  
    console.log(`server is listening on ${port}`)
  })
