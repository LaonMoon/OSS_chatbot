const https = require('https')
const User = require('../models/user').User
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

async function handleEvent(event) {
    const userId = event.source.userId
    let user

    if(await User.isIn(userId)) {
        user = await User.load(userId)
    }
    else {
        user = new User(userId)
        await user.save()
    }

    if(user.state == "following") {
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
            switch(messageLabel(message)) {
                case (label.HELP): {message_help(event); break;}
                case (label.ABOUT): {break;}
                case (label.MENU): {break;}
                case (label.REVIEW): {break;}
                case (label.TODAY): {break;}
                case (label.MYMENU): {break;}
                case (label.ALARM): {Alarm_Handler(event); break;}
                default: {break;}
            }
        }
    }
    else {
        switch(user.state) {
            case 'help_[a-Z]+': {message_help(event); break;}
            case 'about_[a-Z]+': {break;}
            case 'menu_[a-Z]+': {break;}
            case 'review_[a-Z]+': {break;}
            case 'today_[a-Z]+': {break;}
            case 'mymenu_[a-Z]+': {break;}
            case 'alarm_[a-Z]+': {Alarm_Handler(event); break;}
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
    for(idx = 0; idx < table.length; idx++) {
        if (table[idx].includes(message)) return idx
    }
    return -1
}

module.exports.handleEvent = handleEvent