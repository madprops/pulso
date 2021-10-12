const express = require("express")
const config = require("./config.json")
const app = express()

app.get('/update', (req, res) => {
  console.log(req)
})

app.listen(config.port, () => {
  console.info(`Pulso started on port ${config.port}`)
})