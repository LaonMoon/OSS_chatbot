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

const line = require('@line/bot-sdk');
const middleware = require('@line/bot-sdk').middleware
const app = express();

const https = require("https")

const TOKEN = '78M7oFxike1tvAhrg0ukDn8Kz7naarHuZMkwPvhCI2HBhI5YRQyLcTFJeRKWri/mP/Bqm3ySt5kmqzjqk4vFjU1U1FbCe64ooKEeoVQxUAcg3JGF5Wmg+AnwqqrgoMVX9q3aiMNWW8B7wyYFmvDJBgdB04t89/1O/w1cDnyilFU=';
const config = {
  channelAcessToken: '78M7oFxike1tvAhrg0ukDn8Kz7naarHuZMkwPvhCI2HBhI5YRQyLcTFJeRKWri/mP/Bqm3ySt5kmqzjqk4vFjU1U1FbCe64ooKEeoVQxUAcg3JGF5Wmg+AnwqqrgoMVX9q3aiMNWW8B7wyYFmvDJBgdB04t89/1O/w1cDnyilFU=',
  channelSecret: '5574040157de245324727be471e07904'
}

const fs = require('fs');
const path = require('path');
const HTTPS = require('https');
const domain = "2021105604.oss2022chatbot.tk"
const sslport = 3000;


const client = new line.Client({
  channelAccessToken: TOKEN
});


let rankstate=1;
let reviewstate = 1;
let showreviewstate=1;

const errormsg = {"type": "text", "text": "죄송합니다. 오류가 발생했습니다. 잠시후에 사용해 주십시오."};

app.get("/", (req, res) => {
  res.sendStatus(200)
})




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
      case ('오늘 학식 평점 어때'): {showrank(event);break;}
      case ('오늘 학식 후기 어때'): {showreview(event);break;}
      case ('소반'):{
        if(rankstate==2)showrank2(event);
        if(showreviewstate==2)showreview2(event);
        if(reviewstate==2)reply2(event);break;
      }
      case ('특식'):{
        if(rankstate==2)showrank2(event);
        if(showreviewstate==2)showreview2(event);
        if(reviewstate==2)reply2(event);break;
      }
      case ('석식'):{
        if(rankstate==2)showrank2(event);
        if(showreviewstate==2)showreview2(event);
        if(reviewstate==2)reply2(event);break;
      }
      case('0'):
        if(reviewstate==3)reply3(event);break;
      case('1'):
        if(reviewstate==3)reply3(event);break;
      case('2'):
        if(reviewstate==3)reply3(event);break;
      case('3'):
        if(reviewstate==3)reply3(event);break;
      case('4'):
        if(reviewstate==3)reply3(event);break;
      case('5'):
        if(reviewstate==3)reply3(event);break;
      case ('메뉴 지정'): {break;}
      case ('알람 설정'): break;
      default: {
        if (reviewstate == 4) {reply4(event);
        break;} else
        {
          def(event);
          break;
        }
      }


    }
  }
}

app.post("/webhook", middleware(config), function(req, res) {
  Promise
      .all(req.body.events.map(handleEvent))
      .then(result => res.json(result))
      .catch(err => {
        console.error(err)
        res.status(400).end()
      })

})


function def(event){
  try {
    const rpT = event.replyToken;
    const defmsg = {"type": "text", "text": "잘못 입력하셨습니다. 앞선 안내문에 따라 정확하게 입력해주십시오."};

    client.replyMessage(rpT, defmsg);
  }catch(err){
    console.log("show rank error");
    console.log(err);
    client.replyMessage(rpT, errormsg);
  }

}
function showrank(event){
  try{
    const rpT = event.replyToken;
    const showrankmsg = {"type": "text", "text": "학식 리뷰를 보여드리겠습니다.\n먼저, menu의 종류를 입력해주세요(소반,특식,석식)"};

  rankstate=2;

  client.replyMessage(rpT, showrankmsg);

  } catch(err){
    console.log("show rank error");
    console.log(err);
    client.replyMessage(rpT, errormsg);
  }
}

const showrank2=async(event)=>{
  try {
    const rpT = event.replyToken;
    const menu = event.message.text;
    const reviewdata = await getReviewsRanks(menu);
    const dataString = JSON.stringify(reviewdata);
    let messages = []
    console.log(reviewdata);
    for (let row of reviewdata) {
      const message = {
        type: 'text',
        text: "사용자들이 입력한 점수의 평균은" + row['sum(menu_rank)/count(ID)']
      }

      messages.push(message);
    }
    rankstate = 1;
    client.replyMessage(rpT, messages);
  }catch(err){
    console.log(err);
    console.log("show rank2 error");
    client.replyMessage(rpT, errormsg);

  }
}


function showreview(event){
  try {
    const rpT = event.replyToken;
    const showreviewmsg = {"type": "text", "text": "학식 리뷰를 보여드리겠습니다.\n먼저, menu의 종류를 입력해주세요(소반,특식,석식)"};

    client.replyMessage(rpT, showreviewmsg);
    showreviewstate = 2;
    console.log("show reivew1 sucess");
  }catch(err){
    console.log("show review1 error");
    client.replyMessage(rpT, errormsg);
  }

}

const showreview2=async(event)=>{
  try {
    const rpT = event.replyToken;
    const menu = event.message.text;
    console.log(menu);
    const showreviewdata = await getReviewsRanksDescription(menu);
    const dataString = JSON.stringify(showreviewdata);
    console.log(dataString);
    let messages = []
    let i = 1;

    for (let row of showreviewdata) {
      let ii = String(i);
      const message = {
        type: 'text',
        text: ii + "번째 후기\n" + "메뉴 rank : " + row.menu_rank + "\n" + "메뉴 후기 : " + row.menu_description
      }
      i++;
      console.log(i);
      messages.push(message)
    }

    const showreview2msg = {"type": "text", "text": `학식 후기를 보여드리겠습니다.\n'${dataString}'`};
    console.log(showreview2msg)
    client.replyMessage(rpT, messages);
    showreviewstate = 1;
    console.log("show reivew2 sucess");
  }catch(err){
    console.log("show review2 error");
    client.replyMessage(rpT, errormsg);
  }
}

async function makeUser(userId){
  try {
    const rpT = event.replyToken;
    let user = User.load(userId);
    console.log("user save!");
    const sql = `INSERT INTO user(userId, state)
                 VALUES ('${userId}', '${user.state}');`;
    const connection = await pool.getConnection((async conn => conn));
    const saveresult = await connection.query(sql);
    connection.release();
    return saveresult
  }catch(err){
    console.log("makeUser error");
    console.log(err);

    client.replyMessage(rpT, errormsg);
  }
}



function reply(event) {
  try {
    const rpT = event.replyToken;
    const firstmsg = {"type": "text", "text": "학식 리뷰를 입력해주세요.\n먼저, menu의 종류를 입력해주세요(소반,특식,석식)"}
    client.replyMessage(rpT, firstmsg);
    console.log("reply one sucess");
    reviewstate = 2;
  }catch(err){
    console.log("reply1 error");
    console.log(err);

    client.replyMessage(rpT, errormsg);
  }
}

function reply2(event) {
try {
  const rpT = event.replyToken;
  const menu2 = event.message.text;
  global.menu2 = menu2;
  const secondmsg = {"type": "text", "text": "입력해주셔서 감사합니다.\n다음으로, menu의 별점를 0부터5까지 정수형으로 입력하세요"}
  client.replyMessage(rpT, secondmsg);
  console.log("reply two sucess");
  reviewstate = 3;
}catch(err){
  console.log("reply2 error");
  console.log(err);

  client.replyMessage(rpT, errormsg);
}
}

function reply3(event) {
  try {
    const rpT = event.replyToken;
    const menu_rank = parseInt(event.message.text); //menu_rank받아온다.
    global.menu_rank = menu_rank;

    const thirdmsg = {"type": "text", "text": "입력해주셔서 감사합니다. \nmenu에 대한 text후기를 남겨주세요"}
    client.replyMessage(rpT, thirdmsg);
    console.log("reply three sucess");
    reviewstate = 4;
  }catch(err){
    console.log("reply3 error");
    console.log(err);
    client.replyMessage(rpT, errormsg);
  }
}

function reply4(event) {
try {
  const rpT = event.replyToken;
  const menu_description = event.message.text; //menu_description받아온다.

  const fourthmsg = {"type": "text", "text": "학식 리뷰를 입력해주셔서 감사합니다."}
  client.replyMessage(rpT, fourthmsg);
  console.log("reply fourth sucess");
  reviewstate = 1;
  postReviews(menu2, menu_rank, menu_description);
}catch(err){
  console.log("reply4 error");
  console.log(err);
  client.replyMessage(rpT, errormsg);
}
}
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