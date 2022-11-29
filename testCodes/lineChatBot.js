var express = require('express');
var app = express();
const line = require('@line/bot-sdk');


//papago api
var request = require('request');

//번역 api_url
var translate_api_url = 'https://openapi.naver.com/v1/papago/n2mt';

//언어감지 api_url
var languagedetect_api_url = 'https://openapi.naver.com/v1/papago/detectLangs'

// Naver Auth Key
//새로 발급받은 naver papago api id, pw 입력
var client_id = 'xZMx34y7uru1v8lywZ2d';
var client_secret = 'p6L7M7WsH9';

const config = {
  channelAccessToken: `${process.env.channelAccessToken}`,
  channelSecret: `${process.env.channelSecret}`,
};


// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(200).end();
    });
});


// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }
  return new Promise(function(resolve, reject) {
    //언어 감지 option
    var detect_options = {
      url : languagedetect_api_url,
      form : {'query': event.message.text},
      headers: {'X-Naver-Client-Id': client_id, 'X-Naver-Client-Secret': client_secret}
    };

    //papago 언어 감지
    request.post(detect_options,function(error,response,body){
      console.log(response.statusCode);
      if(!error && response.statusCode == 200){
        var detect_body = JSON.parse(response.body);
        var source = '';
        var target = '';
        var result = { type: 'text', text:''};

        //언어 감지가 제대로 됐는지 확인
        console.log(detect_body.langCode);


        //번역은 한국어->영어 / 영어->한국어만 지원
        if(detect_body.langCode == 'ko'||detect_body.langCode == 'en'){
          source = detect_body.langCode == 'ko' ? 'ko':'en';
          target = source == 'ko' ? 'en':'ko';
          //papago 번역 option
          var options = {
              url:  translate_api_url,
              // 한국어(source : ko), 영어(target: en), 카톡에서 받는 메시지(text)
              form: {'source':source, 'target':target, 'text':event.message.text},
              headers: {'X-Naver-Client-Id': client_id, 'X-Naver-Client-Secret': client_secret}
          };

          // Naver Post API
          request.post(options, function(error, response, body){
              // Translate API Sucess
              if(!error && response.statusCode == 200){
                  // JSON
                  var objBody = JSON.parse(response.body);
                  // Message 잘 찍히는지 확인

                  result.text = objBody.message.result.translatedText;
                  console.log(result.text);
                  //번역된 문장 보내기
                  client.replyMessage(event.replyToken,result).then(resolve).catch(reject);
              }
          });
        }
        // 메시지의 언어가 영어 또는 한국어가 아닐 경우
        else{
          result.text = '언어를 감지할 수 없습니다. \n 번역 언어는 한글 또는 영어만 가능합니다.';
          client.replyMessage(event.replyToken,result).then(resolve).catch(reject);
        }

      }

    });

    });
  }

app.listen(3000, function () {
  console.log('Linebot listening on port 3000!');
});
