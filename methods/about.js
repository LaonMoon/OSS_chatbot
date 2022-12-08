const Client = require('@line/bot-sdk').Client
const TOKEN = process.env.TOKEN
const User = require('../models/user').User
const db = require('./database')
const client = new Client({
    channelAccessToken: TOKEN
})

async function post_about(eventObj) {
    let total = User.TotalUser
    console.log(total)
    const replyToken = eventObj.replyToken
    const userNum = await TakeUserNum()
    const reviewNum = await TakeReviewNum()
    const messages = [
        {
            "type":"text",
            "text":"제2기숙사 학식 알리미 챗봇에 대한 설명입니다."
        },
        // DB에서 누적 사용자 데이터 가져오기
        {
            "type":"text",
            "text":`누적 사용자 수 : ${userNum} `
        },
        // // DB에서 오늘의 식단 리뷰 정보 가져오기    
        {
             "type":"text",
             "text":`오늘의 식단 리뷰 수 : ${reviewNum} `
        },
        // 그 외 정보
        {
            "type":"text",
            "text":"2022 오픈소스SW개발 팀프로젝트로 진행되었으며, 서비스 시작일은 12월 9일입니다."
        },
        {
            "type":"text",
            "text":"더 자세한 명령어에 대한 내용은 'help' 명령어를 이용해주세요."
        }
    ]

    client.replyMessage(replyToken, messages)
}

async function TakeUserNum() {
    return await User.userNum()
}

async function TakeReviewNum () {
    const sql = 'SELECT ID FROM menu_review'
    const result = await db.Execute(sql)
    return result.length
}

module.exports.post_about = post_about