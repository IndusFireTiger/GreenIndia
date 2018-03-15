'use strict'
let http = require('http')
let fs = require('fs')

let server = http.createServer(function (req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    })
    console.log('request was made : ' + req.url)
    if (req.url == '/home' || req.url === '/') {
        console.log('dirname' + __dirname)
        res.writeHead(200, {
            'Content-Type': 'text/html'
        })
        fs.createReadStream(__dirname + '/index.html').pipe(res)
    }
    if (req.url == '/ForestReport') {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        })
        fs.createReadStream(__dirname + '/ForestInIndia.html').pipe(res)
    }
    if (req.url == '/StateData') {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        })
        let data = fs.createReadStream(__dirname + '/States_wise_data.json').pipe(res)
        // console.log(data)
        // res.end(JSON.stringify(data))
    }
})

let port = 5432
server.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log('server is listening on '+port)
})