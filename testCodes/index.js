import express from "express"
import {postReviews,getReviewsRanks} from "./rank/rankController"
import {createreview,showReview,showMenuRank} from "./rank/rankService"
import { insertreview,selectReview,selectmenurank } from "./rank/rankDao";
require("dotenv").config();
import app from './config/express';


const https = require("https")

// const PORT = process.env.PORT || 3000
const TOKEN = '78M7oFxike1tvAhrg0ukDn8Kz7naarHuZMkwPvhCI2HBhI5YRQyLcTFJeRKWri/mP/Bqm3ySt5kmqzjqk4vFjU1U1FbCe64ooKEeoVQxUAcg3JGF5Wmg+AnwqqrgoMVX9q3aiMNWW8B7wyYFmvDJBgdB04t89/1O/w1cDnyilFU=';

const fs = require('fs');
const path = require('path');
const HTTPS = require('https');
const domain = "2021105604.oss2022chatbot.tk"
const sslport = 3000;

app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

app.get("/", (req, res) => {
  res.sendStatus(200)
})

const line = require('@line/bot-sdk');

const client = new line.Client({
  channelAccessToken: TOKEN
});

app.post("/webhook", function(req, res) {
  res.send("HTTP POST request sent to the webhook URL!")
  // If the user sends a message to your bot, send a reply message
  if (req.body.events[0].type === "message") {
    // Message data, must be stringified
    const dataString = JSON.stringify({
      replyToken: req.body.events[0].replyToken,
      messages: [
        {
          "type": "text",
          "text": "Hello, user"
        },
        {
          "type": "text",
          "text": "May I help you?"
        }
      ]
    })

    // Request header
    const headers = {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + TOKEN
    }

    // Options to pass into the request
    const webhookOptions = {
      "hostname": "api.line.me",
      "path": "/v2/bot/message/reply",
      "method": "POST",
      "headers": headers,
      "body": dataString
    }

    // Define request
    const request = https.request(webhookOptions, (res) => {
      res.on("data", (d) => {
        process.stdout.write(d)
      })
    })

    // Handle error
    request.on("error", (err) => {
      console.error(err)
    })

    // Send data
    request.write(dataString)
    request.end()
  }
})


try {
    const option = {
      ca: fs.readFileSync('/etc/letsencrypt/live/' + domain +'/fullchain.pem'),
      key: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/' + domain +'/privkey.pem'), 'utf8').toString(),
      cert: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/' + domain +'/cert.pem'), 'utf8').toString(),
    };
  
    HTTPS.createServer(option, app).listen(sslport, () => {
      console.log(`[HTTPS] Server is started on port ${sslport}`);
    });
  } catch (error) {
    console.log('[HTTPS] HTTPS 오류가 발생하였습니다. HTTPS 서버는 실행되지 않습니다.');
    console.log(error);
  }