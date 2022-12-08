const https = require('https')
const User = require('../models/user').User
const message_help = require('./help').message_help
const menu_dialogue = require('./menu').menu_dialogue
const mymenu_dialogue = require('./mymenu').mymenu_dialogue
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
    console.log(user.userId)
    console.log(user.state)
    console.log(user.buffer)
    console.log(user.alarmTime)
    console.log(user.menuList)

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
                case (label.HELP): {await message_help(event); break;}
                case (label.ABOUT): {break;}
                case (label.MENU): {await menu_dialogue(event); break;}
                case (label.REVIEW): {break;}
                case (label.TODAY): {break;}
                case (label.MYMENU): {await mymenu_dialogue(event); break;}
                case (label.ALARM): {await Alarm_Handler(event); break;}
                default: {break;}
            }
        }
    }
    else {
        switch(checkState(user)) {
            case label.HELP: {await message_help(event); break;}
            case label.ABOUT: {break;}
            case label.MENU: {await menu_dialogue(event); break;}
            case label.REVIEW: {break;}
            case label.TODAY: {break;}
            case label.MYMENU: {await mymenu_dialogue(event); break;}
            case label.ALARM: {await Alarm_Handler(event); break;}
            default: {break;}
        }
    }
}

function messageLabel(message) {
    try {
        let table = [
            ['help', '도움말', '명령어'],
            ['about', '서비스 소개'],
            ['오늘 메뉴 알려줘', '내일 메뉴 알려줘', '이번주 메뉴 알려줘'],
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
    catch(err) {
        throw err
    }
}
function checkState(user) {
    try {
        const state = user.state
        let filters = [
            /^help/,
            /^about/,
            /^menu/,
            /^review/,
            /^today/,
            /^mymenu/,
            /^alarm/
        ]
        let idx = 0
        for(idx = 0; idx < filters.length; idx++) {
            if (filters[idx].test(state)) return idx
        }
        return -1
    }
    catch(err) {
        throw err
    }
}

module.exports.handleEvent = handleEvent