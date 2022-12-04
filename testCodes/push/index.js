//import express from "/home/ec2-user/OSS_chatbot/testCodes/config/express.js"
import {postReviews, getReviewsRanks,getReviewsRanksDescription} from "./rank/rankController";
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

let rankstate=1;
let reviewstate = 1;

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
      case ('오늘 학식 어때'): {showrank(event);break;}
      case ('소반'||'특식'||'석식'):{
        if(rankstate=2){showrank2(event);
        else if(reviewstate=2)reply2(event);break;}
      }
      case('0'|'1'|'2'|'3'|'4'|'5'):{
        if(rankstate=3)reply3(evnet);break;
      }
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

function showrank(event){
  const client = new line.Client({
    channelAccessToken: TOKEN
  });

  const rpT = event.replyToken;

  const showrankmsg = {"type": "text", "text": "학식 리뷰를 보여드리겠습니다.\n먼저, menu의 종류를 입력해주세요(소반,특식,석식)"};

  client.replyMessage(rpT, showrankmsg);


  const sucess='1';
  rankstate=2;
  return sucess;
}

const showrank2=async(event)=>{
  const client = new line.Client({
    channelAccessToken: TOKEN
  });
  const rpT = event.replyToken;
  const menu= event.message.text;
  console.log(menu);
  const reviewdata = await getReviewsRanksDescription(menu);
  console.log(reviewdata);
  const dataString = JSON.stringify(reviewdata);
  console.log(dataString);
  const showrank2msg = {"type": "text", "text": `학식 리뷰를 보여드리겠습니다.\n'${dataString}'`};
  console.log(showrank2msg)

  rankstate=1;
  client.replyMessage(rpT,showrank2msg);

}

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

const client = new line.Client({
  channelAccessToken: TOKEN
});


const fourthmsg = {"type": "text", "text": "text후기를 남겨주세요"}
const fifthmsg = {"type": "text", "text": "학식 리뷰를 입력해주셔서 감사합니다."}



function reply(event) {
  //const userId = event.source.userId;
  //let user = User.load(userId);
  //console.log(user.state);
  //console.log(user);
  const rpT = event.replyToken;
  const firstmsg = {"type": "text", "text": "학식 리뷰를 입력해주세요.\n먼저, menu의 종류를 입력해주세요(소반,특식,석식)"}
  client.replyMessage(rpT, firstmsg);
  console.log("reply one sucess");
  reviewstate = 2;
}

function reply2(event) {

  const menu2= event.message.text;
  const rpT = event.replyToken;
  const secondmsg = {"type": "text", "text": "입력해주셔서 감사합니다.\n다음으로, menu의 별점를 0부터5까지 정수형으로 입력하세요"}
  client.replyMessage(rpT, secondmsg);
  console.log("reply two sucess");
  reviewstate = 3;
  }

function reply3(event) {

  const menu_rank= parseInt(event.message.text); //menu_rank받아온다.
  const rpT = event.replyToken;
  const thirdmsg = {"type": "text", "text": "입력해주셔서 감사합니다. \nmenu에 대한 text후기를 남겨주세요"}
  client.replyMessage(rpT, thirdmsg);
  console.log("reply three sucess");
  reviewstate = 4;
}

function reply4(event) {

  const menu_description = event.message.text; //menu_description받아온다.
  const rpT = event.replyToken;
  const fourthmsg = {"type": "text", "text": "학식 리뷰를 입력해주셔서 감사합니다."}
  client.replyMessage(rpT, fourthmsg);
  console.log("reply fourth sucess");
  reviewstate = 1;
}
 /* while(i!=7){
    var i=1;
    if (i==0) {
      makeUser(userId)
     // i=1;
    }


    if (i==1) {

      //i=2;
      //console.log(i);
    }

    else if (i ==2) {
      const menu = event.message.text;
      client.replyMessage(rpT, secondmsg);
      //i= 3;
    }

    else if (i == 3) {
      const menu_rank = event.message.text;
      client.replyMessage(rpT, thirdmsg);
      i = 4;
    }

    else if (i == 4) {
      if (event.message.text = "yes") {
        user.state = 5;
      } else {
        const menu_description = "";
        i = 6;
      }
    }

    else if (i == 5) {
      const menu_description = event.message.text;
      client.replyMessage(rpT, fourthmsg);
      i = 6;
    }
    else if (i == 6) {
      client.replyMessage(rpT, fifthmsg);
      postReviews(menu,menu_rank,menu_description);
      i= 7;
    }
  }
}*/


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