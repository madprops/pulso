const express = require("express")
const config = require("./config.json")
const http = require("http")
const crypto = require("crypto")
const exec = require("child_process").exec
const app = express()

app.use(express.json())

app.post('/update', (req, res) => {
  let sig = "sha1=" + crypto.createHmac('sha1', config.secret).update(chunk.toString()).digest('hex')

  if (req.headers['x-hub-signature'] === sig) {
    console.log("valid")
  } else {
    console.log("not valid")
  }
})

app.listen(config.port, () => {
  console.info(`Pulso started on port ${config.port}`)
})