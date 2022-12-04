var express = require('express');
const request = require('request');
const TARGET_URL = 'https://api.line.me/v2/bot/message/reply'
const TOKEN = '...'
const fs = require('fs');
const path = require('path');
const HTTPS = require('https');
const domain = "..."
const sslport = 23023;

const bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
app.post('/hook', function (req, res) {

    var eventObj = req.body.events[0];
    var source = eventObj.source;
    var message = eventObj.message;

    // request log
    console.log('======================', new Date() ,'======================');
    console.log('[request]', req.body);
    console.log('[request source] ', eventObj.source);
    console.log('[request message]', eventObj.message);
   
    if (eventObj.message.text=="about"||eventObj.message.text=="About"||eventObj.message.text=="설명"||eventObj.message.text=="정보"){
        post_about(eventObj.replyToken, eventObj);
    }

    res.sendStatus(200);
});

function post_about(replyToken,eventObj) {
    request.post(
        {
            url: TARGET_URL,
            headers: {
                'Authorization': `Bearer ${TOKEN}`
            },
            json: {
                "replyToken":eventObj.replyToken,
                "messages":[
                    {
                        "type":"text",
                        "text":"제2기숙사 학식 알리미 챗봇에 대한 설명입니다."
                    },
                    // DB에서 누적 사용자 데이터 가져오기
                    {
                        "type":"text",
                        "text":"누적 사용자 수 :"
                    },                
                    // DB에서 오늘의 식단 리뷰 정보 가져오기    
                    {
                        "type":"text",
                        "text":"오늘의 식단 리뷰 수 :"
                    },
                    // 그 외 정보
                    {
                        "type":"text",
                        "text":"2022 오픈소스SW개발 팀프로젝트로 진행되었으며, 서비스 시작일은 12월 3일입니다."
                    }
                ]
            }
        },(error, response, body) => {
            console.log(body)
        });
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
  
