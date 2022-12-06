const Client = require('@line/bot-sdk').Client
const MenuData = require('../models/menudata').MenuData


const TOKEN = process.env.TOKEN || 'n/FsngKwPgrLhglag8dqI994iPBAFGlWAZ049Hiq1F5tsguZbDxksyWj3zskC0TFsCOCGraTNp0yg7YLdTm+wOZeDuUKNuu/2Xvz9azWjqMyKy3t+68MjDEK50ytYmjcQFImAvBJ5hC1ZayLOqHcSwdB04t89/1O/w1cDnyilFU='

async function menu_dialogue(event) {
    try {
        const today =  new Date()
        var year = today.getFullYear();
        var month = ('0' + (today.getMonth() + 1)).slice(-2);
        var date = ('0' + today.getDate()).slice(-2);
        const todayDate = String(year + '-' + month + '-' + date)

        const menudata = await MenuData.load(todayDate)
        const data = menudata.data[0]
        const text_lunch = `[점심 메뉴]\n\n${data.lunch_A}\n\n${data.lunch_B}`
        const text_dinner = `[저녁 메뉴]\n\n${data.dinner}`
        replyToken = event.replyToken
        const messages = [
            {
                type: "text",
                "text": text_lunch
            },
            {
                type: "text",
                "text": text_dinner
            }
        ]

        const client = new Client({
            channelAccessToken: TOKEN
        })
        client.replyMessage(replyToken, messages)
    }
    catch(err) {
        throw err
    }
}

module.exports.menu_dialogue = menu_dialogue