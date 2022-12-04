const https = require('https')
const User = require('../models/user')
const message_help = require('./help').message_help
const Alarm_Handler = require('./alarmhandler').Alarm_Handler

const label = {
    HELP: 0,
    ABOUT: 1,
    MENU: 2,
    REVIEW: 3,
    TODAY: 4,
    MYMENU: 5,
    ALARM: 6
}
Object.freeze(label)

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
        switch(messageLabel(message)) {
            case (label.HELP): {message_help(event); break;}
            case (label.ABOUT): {break;}
            case (label.MENU): {break;}
            case (label.REVIEW): {break;}
            case (label.TODAY): {break;}
            case (label.MYMENU): {break;}
            case (label.ALARM): {Alarm_Handler(eventObj); break;}
            default: {break;}
        }
    }
}

function messageLabel(message) {
    let table = [
        ['help', '도움말', '명령어'],
        ['about', '서비스 소개'],
        ['오늘 메뉴 알려줘', '내일 메뉴 알려줘', '이번 주 메뉴 알려줘'],
        ['리뷰 작성'],
        ['오늘 학식 어때'],
        ['메뉴 지정'],
        ['알람 설정']
    ]
    let idx = 0
    for(idx in table) {
        if (table[idx].includes(message)) return idx
    }
    return -1
}

module.exports.handleEvent = handleEvent