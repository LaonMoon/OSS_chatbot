const Client = require('@line/bot-sdk').Client
const client = new Client({
    channelAccessToken: process.env.TOKEN
})

function message_help(event) {
    const text = `[help/도움말/명령어] : 사용할 수 있는 명령을 보여드려요.\n[about/서비스 소개] : 챗봇에 대한 정보를 알아보세요.\n[오늘|내일|이번주 메뉴 알려줘] : 오늘, 내일 혹은 이번주의 메뉴를 알려줍니다.\n[리뷰 작성] : 오늘의 리뷰를 남겨보세요!\n[오늘 학식 평점 어때] : 오늘의 학식 평점 평균을 확인해요.\n[오늘 학식 후기 어때] : 학생들이 남긴 학식 한줄평을 살펴봐요. \n[메뉴 지정] : 좋아하는 메뉴를 미리 설정하고 알림을 받아요.\n[알람 설정] : 원하는 시간에 학식 정보를 받을 수 있습니다.`
    const replyToken = event.replyToken
    const message = {
        type: "text",
        text: text
    }
    client.replyMessage(replyToken, message)
}

module.exports.message_help = message_help