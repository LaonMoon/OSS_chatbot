const db = require('./database')
const User = require('../models/user').User
const createAndSendMessage = require('./menu').createAndSendMessage
const MenuData = require('../models/menudata').MenuData
const Client = require('@line/bot-sdk').Client
const client = new Client({
    channelAccessToken: process.env.TOKEN
})

function getKoreanDate() {
    const america = new Date()
    const offset = 32400000
    const korea = new Date(america.getTime()+offset)
    const year = korea.getFullYear()
    const month = ('0' + (korea.getMonth() + 1)).slice(-2)
    const date = ('0' + korea.getDate()).slice(-2)
    const dateToday = String(year + '-' + month  + '-' + date)
    return dateToday
}
function initAlarm(targetTimeFormat) {
    const dailyTime = 86400000
    const america = new Date()
    const offset = 32400000
    const korea = new Date(america.getTime()+offset)
    const year = korea.getFullYear()
    const month = ('0' + (korea.getMonth() + 1)).slice(-2)
    const date = ('0' + korea.getDate()).slice(-2)
    const dateToday = String(year + '-' + month  + '-' + date)
    let targetTimestamp = new Date(dateToday + targetTimeFormat).getTime()
    const nowTimestamp = korea.getTime()
    if(targetTimestamp < nowTimestamp) {
        targetTimestamp += dailyTime
    }
    const interval = targetTimestamp - nowTimestamp
    setTimeout(timer, interval)
}
async function timer() {
    await alarm()
    setInterval(alarm, 86400000)
}
async function alarm() {
    try {
        const sql = 'SELECT DISTINCT userId FROM user_menulist'
        const result = await db.Execute(sql)
        for(let row of result) {
            const id = row.userId
            let user = await User.load(id)
            const menudata = await MenuData.load([getKoreanDate()])
            const menuToday = menudata.data[0]
            const lunch_A = menuToday.lunch_A
            const lunch_B = menuToday.lunch_B
            const dinner = menuToday.dinner
            for(let menu of user.menuList) {
                if (lunch_A.includes(menu) || lunch_B.includes(menu) || dinner.includes(menu)) {
                    const text_lunch_A = `[점심 메뉴]\n${lunch_A}\n`
                    const text_lunch_B = `${lunch_B}\n`
                    const text_dinner = `[저녁 메뉴]\n${dinner}`
                    const text1 = text_lunch_A + text_lunch_B + text_dinner
                    const text2 = '오늘 좋아하는 메뉴가 나와요.\n어서 확인해보세요!'
                    const messages = [{
                            type: "text",
                            text: text1
                        },{
                            type: "text",
                            text: text2
                        }
                    ]
                    await client.pushMessage(id, messages)
                    break
                }
            }
        }
    }
    catch(err) {
        throw err
    }
}

module.exports.initAlarm = initAlarm