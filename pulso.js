const express = require("express")
const config = require("./config.json")
const app = express()

app.post('/update', (req, res) => {
  console.log(req.body)
})

app.listen(config.port, () => {
  console.info(`Pulso started on port ${config.port}`)
})