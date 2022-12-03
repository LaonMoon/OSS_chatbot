//import express from "/home/ec2-user/OSS_chatbot/testCodes/config/express.js"
import {postReviews, getReviewsRanks} from "./rank/rankController";
require("dotenv").config();
import pool from "./config/database"
import express from "express"
import compression from "compression"
import methodOverride from "method-override"
import cors from "cors"
import rankRouter from "./rank/rankRouter";
import User from "./user";

const app = express();
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride());
app.use(cors());

app.use('/reviews',rankRouter);

const https = require("https")

// const PORT = process.env.PORT || 3000
const TOKEN = '78M7oFxike1tvAhrg0ukDn8Kz7naarHuZMkwPvhCI2HBhI5YRQyLcTFJeRKWri/mP/Bqm3ySt5kmqzjqk4vFjU1U1FbCe64ooKEeoVQxUAcg3JGF5Wmg+AnwqqrgoMVX9q3aiMNWW8B7wyYFmvDJBgdB04t89/1O/w1cDnyilFU=';

const fs = require('fs');
const path = require('path');
const HTTPS = require('https');
const domain = "2021105604.oss2022chatbot.tk"
const sslport = 3000;


app.get("/", (req, res) => {
  res.sendStatus(200)
})

const line = require('@line/bot-sdk');


function handleEvent(event) {
  // FOLLOW EVENT


  if (event.type === "follow") {

  }
  // UNFOLLOW EVENT
  if (event.type === "unfollow") {

  }
  // MESSAGE EVENT
  if (event.type === "message") {
    const message = event.message.text
    // cases
    switch(message) {
      //case ('help'  || '도움말' || '명령어'): {message_help(event); break;}
      case ('about' || '서비스 소개'): {break;}
      case ('오늘 메뉴 알려줘' || '내일 메뉴 알려줘'
          || '이번 주 메뉴 알려줘'): {break;}
      case ('리뷰 작성'): {reply(event); break;}
      case ('오늘 학식 어때'): {break;}
      case ('메뉴 지정'): {break;}
      case ('알람 설정'): {break;}
    }
  }
}

app.post("/webhook", function(req, res) {
  res.send("HTTP POST request sent to the webhook URL!")
  // If the user sends a message to your bot, send a reply message
  req.body.events.map(handleEvent);

})



async function makeUser(userId){
  let user = User.load(userId);
  console.log("user save!");
  const sql = `INSERT INTO user(userId, state) VALUES ('${userId}', '${user.state}');`;
  const connection = await pool.getConnection((async conn=>conn));
  const saveresult = await connection.query(sql);
  connection.release();
  return saveresult
}

async function loadUser(userId){

}

function reply(event) {
  const userId = event.source.userId;
  let user = User.load(userId);
  //console.log(user);
  //while (user.state != '6') {
    const client = new line.Client({
      channelAccessToken: TOKEN
    });

    if(user.state=''){
      makeUser(userId);
      user.state='1';
      reply(event);
    }

    const firstmsg = {"type": "text", "text": "학식 리뷰를 입력해주세요.\n먼저, menu의 종류를 입력해주세요(소반,특식,석식)"}
    const secondmsg = {"type": "text", "text": "입력해주셔서 감사합니다.\n다음으로, menu의 별점를 0부터5까지 정수형으로 입력하세요"}
    const thirdmsg = {"type": "text", "text": "입력해주셔서 감사합니다. \nmenu에 대한 text후기를 남기시겠습니까?(yes or no)"}
    const fourthmsg = {"type": "text", "text": "text후기를 남겨주세요"}
    const fifthmsg = {"type": "text", "text": "학식 리뷰를 입력해주셔서 감사합니다."}
    const rpT = event.replyToken;

    if (user.state = '1') {
      client.replyMessage(rpT, firstmsg);
      user.state = '2';
    }

    if (user.state = '2') {
      const menu = event.message.text;
      client.replyMessage(rpT, secondmsg);
      user.state = '3';
    }

    if (user.state = '3') {
      const menu_rank = event.message.text;
      client.replyMessage(rpT, thirdmsg);
      user.state = '4';
    }

    if (user.stae = '4') {
      if (event.message.text = "yes") {
        user.state = '5';
      } else {
        const menu_description = "";
        user.state = '6';
      }
    }

    if (user.state = '5') {
      const menu_description = event.message.text;
      client.replyMessage(rpT, fourthmsg);
      user.state = '6';
    }
    if (user.state = '6') {
      client.replyMessage(rpT, fifthmsg);
    }
  }


/*
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
    }

    // Handle error
    request.on("error", (err) => {
      console.error(err)
    })

    // Send data
    request.write(dataString)
    request.end()
  }
})
)*/

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