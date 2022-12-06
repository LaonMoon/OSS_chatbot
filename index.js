const https = require('https')
const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const app = express()
const middleware = require('@line/bot-sdk').middleware
const handleEvent = require('./methods/eventHandler').handleEvent

app.get("/", (req, res) => {
    res.sendStatus(200)
})

const config = {
    channelAcessToken: process.env.TOKEN,
    channelSecret: process.env.SECRET
}

app.post("/webhook", middleware(config), (req, res) => {
    Promise
    .all(req.body.events.map(handleEvent))
    .then(result => res.json(result))
    .catch(err => {
        console.error(err)
        res.status(400).end()
    })
})

const domain = "2017104014.oss2022chatbot.ml"
const sslport = 23023;
const option = {
    ca: fs.readFileSync('/etc/letsencrypt/live/' + domain +'/fullchain.pem'),
    key: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/' + domain +'/privkey.pem'), 'utf8').toString(),
    cert: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/' + domain +'/cert.pem'), 'utf8').toString(),
}

https.createServer(option, app).listen(sslport, () => {
    console.log(`[HTTPS] Server is started on port ${sslport}`);
})