"use strict"
let http = require("http")
let fs = require("fs")
let path = require("path")

let server = http.createServer(function(req, res) {
  console.log("a request was made : " + req.url)
  res.writeHead(200, {
    "Content-Type": "text/html"
  })

  let fileType = path.extname(req.url)
  let resType
  switch (fileType) {
    case ".js":
      resType = "text/javascript"
      break
    case ".css":
      resType = "text/css"
      break
    case ".json":
      resType = "application/json"
      break
    case ".png":
      resType = "image/png"
      break
    case ".jpg":
      resType = "image/jpg"
      break
    case ".svg":
      resType = "image/svg"
      break
    default:
      resType = "text/html"
  }

  let filePath = path.join(".", req.url)
  if (filePath === "./") {
    filePath = "./index.html"
  } else {
    filePath = path.join(__dirname, "public", fileType.slice(1), req.url)
  }

  console.log("filepath:" + filePath)
  let fileout = fs.createReadStream(filePath)
  res.writeHead(200, {
    "Content-Type": resType
  })
  fileout
    .on("error", function(error) {
      console.log("Error:", error.message)
    })
    .pipe(res)
})

let port = 5432
server.listen(port, err => {
  if (err) {
    return console.log("error on server", err)
  }
  console.log("Server is listening on " + port)
})
