const fs = require("fs")
const crypto = require("crypto")
const express = require("express")
const config = require("./config.json")
const sigHeaderName = "X-Hub-Signature-256"
const sigHashAlg = "sha256"
const { execSync } = require("child_process")

const app = express()

app.use(express.json({
  verify: (req, res, buf, encoding) => {
    if (buf && buf.length) {
      req.rawBody = buf.toString(encoding || "utf8")
    }
  },
}))

function verifyPostData(req, res, next) {
  if (!req.rawBody) {
    return next("Request body empty")
  }

  const sig = Buffer.from(req.get(sigHeaderName) || "", "utf8")
  const hmac = crypto.createHmac(sigHashAlg, config.secret)
  const digest = Buffer.from(sigHashAlg + "=" + hmac.update(req.rawBody).digest("hex"), "utf8")
  
  if (sig.length !== digest.length || !crypto.timingSafeEqual(digest, sig)) {
    return next(`Request body digest (${digest}) did not match ${sigHeaderName} (${sig})`)
  }

  return next()
}

app.post("/update", verifyPostData, function (req, res) {
  console.info("Verification successful")
  let repo = req.body.repository.name
  
  if (config.repos[repo]) {
    console.info(`Executing actions for ${repo}`)
    execSync(config.repos[repo])
  }

  fs.writeFileSync("last_response.json", JSON.stringify(req.body))
})

app.use((err, req, res, next) => {
  if (err) console.error(err)
  res.status(403).send("Request body was not signed or verification failed")
})

app.listen(config.port, () => console.info(`Listening on port ${config.port}`))