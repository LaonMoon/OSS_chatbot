const Client = require('@line/bot-sdk').Client
const User = require('../models/user').User
const client = new Client({
    channelAccessToken: process.env.TOKEN
})

async function mymenu_dialogue(event) {
    try {
        const userId = event.source.userId
        let user = await User.load(userId)
        const state = user.state
        switch(state) {
            case 'following': {await mymenu_following(event, user); break;}
            case 'mymenu_checkConfirm': {await mymenu_checkConfirm(event, user); break;}
            case 'mymenu_waitConfirm': {await mymenu_conclude(event, user); break;}
        }
    }
    catch(err) {
        err
    }
}

async function mymenu_following(event, user) {
    try {
        const text = '원하시는 메뉴를 입력해주세요!(간단명료하게 음식을 지정할 수록 더 많은 추천을 받으실 수 있습니다. 눈꽃치즈돈까스(X) → 돈까스, 튀김카레라이스(X) → 카레)'
        const message = {
            type: "text",
            text: text
        }
        const replyToken = event.replyToken
        user.state = "mymenu_checkConfirm"
        await user.save()
        await client.replyMessage(replyToken, message)
    }
    catch(err) {
        throw err
    }
}
async function mymenu_checkConfirm(event, user) {
    try{
        const client_message = event.message
        const text = `“${client_message.text}” 좋아하는 메뉴로 지정하시겠습니까?\n1) 예, 2) 아니오`
        const message = {
            type: "text",
            text: text
        }
        const replyToken = event.replyToken
        user.buffer = client_message.text
        user.state = "mymenu_waitConfirm"
        await user.save()
        await client.replyMessage(replyToken, message)
    }
    catch(err) {
        throw err
    }
}
async function mymenu_conclude(event, user) {
    const client_message = event.message
    switch(client_message.text) {
        case '1': {mymenu_confirm(event, user); break;}
        case '2': {mymenu_cancel(event, user); break;}
    }
}
async function mymenu_confirm(event, user) {
    const text = `“${user.buffer}” 등록되었습니다`
    const message = {
        type: "text",
        text: text
    }
    const replyToken = event.replyToken
    await user.AddMenu(user.buffer)
    user.buffer = '\0'
    user.state = 'following'
    await user.save()
    await client.replyMessage(replyToken, message)
}
async function mymenu_cancel(event, user) {
    const text = '취소되었습니다.'
    const message = {
        type: "text",
        text: text
    }
    const replyToken = event.replyToken
    user.buffer = '\0'
    user.state = 'following'
    await user.save()
    await client.replyMessage(replyToken, message)

}

module.exports.mymenu_dialogue = mymenu_dialogue