/* const User = require("./models/user").User
const MenuData = require('./models/menudata').MenuData

// Example for user class
async function printUser(userId) {
    let user = await User.load(userId)
    console.log("userId : " + user.userId)
    console.log("state : " + user.state)
    console.log("menuList : " + user.menuList)
    console.log("buffer : " + user.buffer)
    console.log("----------------------------------------------------------------------------------------")
}

// Example for menudata class
async function printMenuData(dates) {
    const menudata = await MenuData.load(dates)
    for(let data of menudata.data) {
        console.log("date : " + data.date)
        console.log("lunch_A : " + data.lunch_A)
        console.log("lunch_B : " + data.lunch_B)
        console.log("dinner : " + data.dinner)
        console.log("----------------------------------------------------------------------------------------")

    }
}
async function saveMenuData() {
    const raw = await MenuData.GetMenuData()
    console.log(raw)
    const data = await MenuData.ProcessData(raw)
    console.log(data)
    let menudata = new MenuData(data)
    await menudata.save()
}

async function saveUser(userId) {
    let user = new User(userId)
    await user.save()
}

async function saveReivew() {
    
}

const userId = 'U3c5199b84bae262c48381504168fe4b2'
printUser(userId)

const dates = ['2022-12-06', '2022-12-07']
printMenuData(dates)

//saveUser('abcd')

// saveMenuData() */

const db = require('./methods/database')
const User = require('./models/user').User
const createAndSendMessage = require('./methods/menu').createAndSendMessage
const MenuData = require('./models/menudata').MenuData
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
    const dateToday = getKoreanDate()
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
        const sql = 'SELECT userId FROM user_menulist'
        const result = await db.Execute(sql)
        for(let id of userId) {
            let user = User.load(id)
            const menudata = MenuData.load([getKoreanDate()])
            const menuToday = menudata.data[0]
            const lunch_A = menuToday.lunch_A
            const lunch_B = menuToday.lunch_B
            const dinner = menuToday.dinner
            for(let menu of user.menuList) {
                if (lunch_A.includes(menu) || lunch_B.includes(menu) || dinner.includes(menu)) {
                    const text_lunch_A = `[점심 메뉴]\n${data[0].lunch_A}\n`
                    const text_lunch_B = `${data[0].lunch_B}\n`
                    const text_dinner = `[저녁 메뉴]\n${data[0].dinner}`
                    const text1 = text_lunch_A + text_lunch_B + text_dinner
                    const text2 = '오늘 식단에 좋아하는 메뉴가 있어요.\n어서 확인해보세요!'
                    const messages = [{
                            type: "text",
                            text: text1
                        },{
                            type: "text",
                            text: text2
                        }
                    ]
                    await client.pushMessage(id, messages)
                }
            }
        }
    }
    catch(err) {
        throw err
    }
}
initAlarm('T03:47:10')