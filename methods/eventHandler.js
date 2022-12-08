const https = require('https')
const User = require('../models/user').User
const message_help = require('./help').message_help
const post_about = require('./about').post_about
const menu_dialogue = require('./menu').menu_dialogue
const mymenu_dialogue = require('./mymenu').mymenu_dialogue
const Alarm_Handler = require('./alarmhandler').Alarm_Handler
const review = require('./review').review_Handler
const Client = require('@line/bot-sdk').Client
const client = new Client({
    channelAccessToken: process.env.TOKEN
})
const label = {
    HELP: 0,
    ABOUT: 1,
    MENU: 2,
    REVIEW: 3,
    MYMENU: 4,
    ALARM: 5
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
            const text1 = '학식 알리미 챗봇을 이용해주셔서 감사합니다!'
            const text2 = '"도움말", "명령어", "help" 등을 통해 사용 방법에 대해 알아보세요.'
            const replyToken = event.replyToken
            const message = [{
                    type: "text",
                    text: text1
                },{
                    type: "text",
                    text: text2
                }
            ]
            client.replyMessage(replyToken, message)
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
                case (label.ABOUT): {await post_about(event); break;}
                case (label.MENU): {await menu_dialogue(event); break;}
                case (label.REVIEW): {await review(event);break;}
                case (label.MYMENU): {await mymenu_dialogue(event); break;}
                case (label.ALARM): {await Alarm_Handler(event); break;}
                default: {
                    const text1 = '죄송하지만 지원하지 않는 명령어입니다.'
                    const text2 = '"도움말", "명령어", "help" 등을 통해 사용 방법에 대해 알아보세요.'
                    const replyToken = event.replyToken
                    const message = [{
                            type: "text",
                            text: text1
                        },{
                            type: "text",
                            text: text2
                        }
                    ]
                    client.replyMessage(replyToken, message)
                    break;
                }
            }
        }
    }
    else {
        switch(checkState(user)) {
            case label.HELP: {await message_help(event); break;}
            case label.ABOUT: {await post_about(event); break;}
            case label.MENU: {await menu_dialogue(event); break;}
            case label.REVIEW: {await review(event);break;}
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
            ['리뷰 작성', '오늘 학식 평점 어때', '오늘 학식 후기 어때'],
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