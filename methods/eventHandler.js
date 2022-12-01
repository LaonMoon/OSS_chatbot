const https = require('https')
const message_help = require('./help').message_help

function handleEvent(event) {

    /* console.log(event.message)
    console.log('-----------------message-----------------')
    console.log(event.deliveryContext)
    console.log('-----------------deliveryContext-----------------')
    if (event.type === "message") {
        // Message data, must be stringified
        const dataString = JSON.stringify({
            replyToken: event.replyToken,
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
            "Authorization": "Bearer " + 'n/FsngKwPgrLhglag8dqI994iPBAFGlWAZ049Hiq1F5tsguZbDxksyWj3zskC0TFsCOCGraTNp0yg7YLdTm+wOZeDuUKNuu/2Xvz9azWjqMyKy3t+68MjDEK50ytYmjcQFImAvBJ5hC1ZayLOqHcSwdB04t89/1O/w1cDnyilFU='
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
    } */
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
            case ('help'  || '도움말' || '명령어'): {message_help(event); break;}
            case ('about' || '서비스 소개'): {break;}
            case ('오늘 메뉴 알려줘' || '내일 메뉴 알려줘'
                    || '이번 주 메뉴 알려줘'): {break;}
            case ('리뷰 작성'): {break;}
            case ('오늘 학식 어때'): {break;}
            case ('메뉴 지정'): {break;}
            case ('알람 설정'): {break;}
        }
    }
}

module.exports.handleEvent = handleEvent