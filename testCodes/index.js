const https = require("https")
const express = require("express")
const app = express()
const PORT = process.env.PORT || 3000
const TOKEN = process.env.LINE_ACCESS_TOKEN

app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

app.get("/", (req, res) => {
  res.sendStatus(200)
})

// app.post("/webhook", function(req, res) {
//   res.send("HTTP POST request sent to the webhook URL!")
//   // If the user sends a message to your bot, send a reply message
//   console.log(req)
//   if (req.body.events[0].type === "message") {
//     // Message data, must be stringified
//     const dataString = JSON.stringify({
//       replyToken: req.body.events[0].replyToken,
//       messages: [
//         {
//           "type": "text",
//           "text": "Hello, user"
//         },
//         {
//           "type": "text",
//           "text": "May I help you?"
//         }
//       ]
//     })

//     // Request header
//     const headers = {
//       "Content-Type": "application/json",
//       "Authorization": "Bearer " + TOKEN
//     }

//     // Options to pass into the request
//     const webhookOptions = {
//       "hostname": "api.line.me",
//       "path": "/v2/bot/message/reply",
//       "method": "POST",
//       "headers": headers,
//       "body": dataString
//     }

//     // Define request
//     const request = https.request(webhookOptions, (res) => {
//       res.on("data", (d) => {
//         process.stdout.write(d)
//       })
//     })

//     // Handle error
//     request.on("error", (err) => {
//       console.error(err)
//     })

//     // Send data
//     request.write(dataString)
//     request.end()
//   }
// })

const line = require('@line/bot-sdk');

const client = new line.Client({
  channelAccessToken: TOKEN
});

  
let auth = (req, res, next) => {
	// Session Check
	// 어드민 여부 체크 필요
  if (req.body.events[0].type === "message") {
    if (req.body.events[3].type === "text"){
      let exam = /!알람*/
      if (req.body.events[3].text === exam){
        next();
      }
      else{
        res.send("명령어 인식 Error");
      }
    }
  }
};

let IsInputOk = function (InputTime) {
	let alarmdate = InputTime;
	let time = Number(alarmdate.substring(0,2));
    let minute = Number(alarmdate.substring(2,4));
	let year = new Date().getFullYear()
	let desDay

	if(desDay = new Date(year, time, minute) != NaN){
		return true;
	}
	else{
		return false;
	}
};

function timerFunc(func, dateTime){
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
  }else{
     setTimeout(func, timer);
   return ("Alarm seting!")
  }
}

  app.post("/webhook", auth, function(req, res) {
    res.send("HTTP POST request sent to the webhook URL!")
    // If the user sends a message to your bot, send a reply message
        let str = req.body.events[3].text
        const words = str.split(' ');
        let alarmdate;
        for (let word of words){
            if (word === /[0-9][0-9][0-9][0-9]/){
              alarmdate = word;
            }
        }
        if(!(IsInputOk(alarmdate))){
            res.send("Error");
        }
        let user = req.body.events[0].source.userId;
        
        const message = {
          type: 'text',
          text: 'Hello World!'
        };

        let repmsg = timerFunc( (user, message) => {client.pushMessage(user, message
        );} , alarmdate)
        
      // Message data, must be stringified
      const dataString = JSON.stringify({
        replyToken: req.body.events[0].replyToken,
        messages: [
          {
            "type": "text",
            "text": repmsg
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
  )

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})