const https = require('https')
const message_help = require('./help').message_help
const post_about = require('./about').post_about
const Alarm_Handler = require('./alarmhandler').Alarm_Handler

function handleEvent(event) {
    // FOLLOW EVENT
    if (event.type === "follow") {
        
    }
    // UNFOLLOW EVENT
    if (event.type === "unfollow") {

    }
    // MESSAGE EVENT
    if (event.type === "message") {

        console.log(event.source.userId)
        const message = event.message.text
        // cases
        switch(message) {
            case ('help'  || '도움말' || '명령어'): {message_help(event); break;}
            case ('about' || '서비스 소개'): {post_about(event); break;}
            case ('오늘 메뉴 알려줘' || '내일 메뉴 알려줘'
                    || '이번 주 메뉴 알려줘'): {break;}
            case ('리뷰 작성'): {break;}
            case ('오늘 학식 어때'): {break;}
            case ('메뉴 지정'): {break;}
            case ('알람 설정'): {Alarm_Handler(event); break;}
        }
    }
}

module.exports.handleEvent = handleEvent