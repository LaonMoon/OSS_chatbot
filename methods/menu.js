const Client = require('@line/bot-sdk').Client
const MenuData = require('../models/menudata').MenuData


const TOKEN = process.env.TOKEN || 'n/FsngKwPgrLhglag8dqI994iPBAFGlWAZ049Hiq1F5tsguZbDxksyWj3zskC0TFsCOCGraTNp0yg7YLdTm+wOZeDuUKNuu/2Xvz9azWjqMyKy3t+68MjDEK50ytYmjcQFImAvBJ5hC1ZayLOqHcSwdB04t89/1O/w1cDnyilFU='
const label_menu = {
    TODAY: 0,
    TOMMOROW: 1,
    THISWEEK: 2
}
const day_menu = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일']
Object.freeze(day_menu)
Object.freeze(label_menu)

async function menu_dialogue(event) {
    try {
        const when = messageLabel_menu(event.message)
        const dates = getDates(when)
        const data = await MenuData.load(dates).data
        replyToken = event.replyToken
        const messages = createMessage(data)
        const client = new Client({
            channelAccessToken: TOKEN
        })
        client.replyMessage(replyToken, messages)
    }
    catch(err) {
        throw err
    }
}
function messageLabel_menu(message) {
    const table = ['오늘', '내일', '이번주']
    const when = message.text.slice(0, 2)
    let idx = 0
    for(idx = 0; idx < table.length; idx++) {
        if (when == table[idx]) return idx
    }
    return -1
}
function getDates(when) {
    switch(when) {
        case label_menu.TODAY: {
            const today = new Date()
            const year = today.getFullYear()
            const month = ('0' + (today.getMonth() + 1)).slice(-2)
            const date = ('0' + today.getDate()).slice(-2)
            const dateToday = String(year + '-' + month  + '-' + date)
            return [dateToday]
        }
        case label_menu.TOMMOROW: {
            const today = new Date()
            const year = today.getFullYear()
            const month = ('0' + (today.getMonth() + 1)).slice(-2)
            const date = ('0' + today.getDate() + 1).slice(-2)
            const dateToday = String(year + '-' + month  + '-' + date)
            return [dateToday]
        }
        case label_menu.THISWEEK: {
            const today = new Date();  
            const year_today = currentDay.getFullYear();
            const month_today = currentDay.getMonth() + 1;
            const date_today  = currentDay.getDate();
            const day_today = currentDay.getDay();

            let thisWeek = [];
            for(var i=0; i<7; i++) {
                const monday = new Date(year_today, month_today, date_today + (i - day_today));
                let yyyy = monday.getFullYear()
                let mm = ('0' + monday.getMonth()).slice(-2)
                let dd = ('0' + monday.getDate()).slice(-2)
                thisWeek.push = yyyy + '-' + mm + '-' + dd
            }
            return thisWeek
        }
    }
}
function createMessage(data) {
    try {
        const messages = []
        console.log(data)
        if(data.length == 1) {
            const text_day = day_menu[0]
            const text_lunch_A = `\n\n[점심 메뉴]\n${data[0].lunch_A}\n${data[0].lunch_B}\n`
            const text_lunch_B = `${data[0].lunch_B}\n`
            const text_dinner = `[저녁 메뉴]\n${data[0].dinner}`
            const text = text_day + text_lunch_A + text_lunch_B + text_dinner
            const message = {
                type: "text",
                text: text
            }
            messages.push(message)
        }
        else {
            for(let idx = 0; i < data.length; i++) {
                const text_day = day_menu[idx]
                const text_lunch_A = `\n\n[점심 메뉴]\n${data[idx].lunch_A}\n${data[idx].lunch_B}\n`
                const text_lunch_B = `${data[idx].lunch_B}\n`
                const text_dinner = `[저녁 메뉴]\n${data[idx].dinner}`
                const text = text_day + text_lunch_A + text_lunch_B + text_dinner
                const message = {
                    type: "text",
                    text: text
                }
                messages.push(message)
            }
        }
        return messages
    }
    catch(err) {
        throw err
    }
}

module.exports.menu_dialogue = menu_dialogue