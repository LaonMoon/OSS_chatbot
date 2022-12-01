const https = require("https")
const express = require("express")
const app = express()
// const PORT = process.env.PORT || 3000
const TOKEN = '채널 토큰을 입력해주세요';

const fs = require('fs');
const path = require('path');
const HTTPS = require('https');
const domain = "도메인을 입력해주세요"
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

var user;
var intervalId;

let IsInputOk = function (InputTime) {
	let alarmdate = InputTime;
	let time = Number(alarmdate.substring(0,2));
    let minute = Number(alarmdate.substring(2,4));
	let year = new Date().getFullYear()

	if(desDay = new Date(year, time, minute) != NaN){
		return true;
	}
	else{
		return false;
	}
};

function timerFunc(dateTime, msg){
    let time = Number(dateTime.substring(0,2));
    let minute = Number(dateTime.substring(2,4));
    let today = new Date()
    let year = today.getFullYear()
    let month = today.getMonth()
    let day = today.getDate()
  
    let oprDate = new Date(year, month, day, time, minute); //동작을 원하는 시간의 Date 객체를 생성합니다.
    let nowDate = new Date();
  
    let timer = oprDate.getTime() - nowDate.getTime(); //동작시간의 밀리세컨과 현재시간의 밀리세컨의 차이를 계산합니다.
    if(timer < 0){ //타이머가 0보다 작으면 함수를 종료합니다.
        return ("Error")
    }
    else{
        setTimeout(() => {
            clearInterval(intervalId);
            console.log("Alarm!!");
            client.pushMessage(user, msg);
            intervalId = setInterval(() => {
              console.log(new Date())
              client.pushMessage(user, msg);
          }, 60000);
        } , timer);
        return ("Alarm seting!")
    }
}



app.post("/webhook", function(req, res) {
  res.send("HTTP POST request sent to the webhook URL!")
  // If the user sends a message to your bot, send a reply message
  if (req.body.events[0].type === "message") {
    if (req.body.events[0].message.type === "text"){
      if (/^!알람/.test(req.body.events[0].message.text)){

        let str = req.body.events[0].message.text
        const words = str.match(/\d{2}:?\d{2}/g)
        let alarmdate;
        for (let word of words){
            if (/[0-9][0-9]:?[0-9][0-9]/.test(word)){
              alarmdate = word;
            }
        }
        if(/[0-9][0-9]:[0-9][0-9]/.test(alarmdate)){
          alarmdate = alarmdate.substring(0,2) + alarmdate.substring(3,5);
        }

        let pushmsg = '딩동! 오늘의 메뉴는 “눈꽃돈까스”입니다! 어서 가서 먹어볼까요?';
        let repTok = req.body.events[0].replyToken;

        if(!(IsInputOk(alarmdate))){
            pushmsg = "Alarm set Error";
            const message = {
                type: 'text',
                text: pushmsg
              };
            client.replyMessage(repTok, message)
        }
        
        user = req.body.events[0].source.userId;
        
        const message = {
          type: 'text',
          text: pushmsg
        };

        let retm = timerFunc(alarmdate, message);
        console.log(retm);
        if(retm == "Error"){
            pushmsg = "TimeSetError"
            const message = {
                type: 'text',
                text: pushmsg
              };
            client.replyMessage(repTok, message)
        }
        else{
          pushmsg = "좋아요, 그럼 매일  “" + alarmdate.substring(0,2) + "시” “" + alarmdate.substring(2,4) + "분”에 오늘의 식단을 알려드릴게요"

          const message = {
              type: 'text',
              text: pushmsg
            };
          client.replyMessage(repTok, message)
        }
      }
  


  else {
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
}
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