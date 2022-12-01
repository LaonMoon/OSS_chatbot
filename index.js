const https = require('https')
const fs = require('fs')
const path = require('path')
const express = require('express')
const app = express()
const line = require('@line/bot-sdk')
const middleware = require('@line/bot-sdk').middleware
const handleEvent = require('./methods/eventHandler').handleEvent

const PORT = process.env.PORT || 23023
const TOKEN = process.env.LINE_ACCESS_TOKEN || 'n/FsngKwPgrLhglag8dqI994iPBAFGlWAZ049Hiq1F5tsguZbDxksyWj3zskC0TFsCOCGraTNp0yg7YLdTm+wOZeDuUKNuu/2Xvz9azWjqMyKy3t+68MjDEK50ytYmjcQFImAvBJ5hC1ZayLOqHcSwdB04t89/1O/w1cDnyilFU='

/* app.use(express.json())
app.use(express.urlencoded({extended: true})) */

app.get("/", (req, res) => {
    res.sendStatus(200)
})

const config = {
    channelAcessToken: 'n/FsngKwPgrLhglag8dqI994iPBAFGlWAZ049Hiq1F5tsguZbDxksyWj3zskC0TFsCOCGraTNp0yg7YLdTm+wOZeDuUKNuu/2Xvz9azWjqMyKy3t+68MjDEK50ytYmjcQFImAvBJ5hC1ZayLOqHcSwdB04t89/1O/w1cDnyilFU=',
    channelSecret: '3937dd366ad9ae26ec016a2abc831513'
}

app.post("/webhook", middleware(config), (req, res) => {
    res.send("HTTP POST request sent to the webhook URL!")
    // If the user sends a message to your bot, send a reply message
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