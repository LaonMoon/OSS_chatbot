const Client = require('@line/bot-sdk').Client

function message_help(event) {
    const text = `- help : 사용할 수 있는 명령을 보여드려요.\n- about : about, 서비스 소개 등의 명령을 통해 챗봇에 대한 정보를 알아보세요.\n- 오늘/내일/이번주/(다음주) 메뉴 : ‘[오늘/내일/이번주/다음주] 메뉴 알려줘’를 통해 오늘의 메뉴를 알아봐요.\n- 오늘 학식 리뷰 입력 : “학식 리뷰, 메뉴 리뷰” 등을 이용해 오늘의 리뷰를 남겨봐요.\n- 오늘 학식 리뷰 출력 : “학식 어때, 오늘 메뉴 어때” 등을 통해 오늘의 리뷰를 확인해요.\n- 사용자 메뉴 지정 : “메뉴 지정”을 통해 좋아하는 메뉴를 미리 설정하고 알림을 받아요.\n- 사용자 지정 메뉴 알림\n- 시간 설정\n- 정해진 시간에 메뉴 알림\n`

    replyToken = event.replyToken
    const message = {
        type: "text",
        text: text
    }

    const client = new Client({
        channelAccessToken: process.env.TOKEN
    })
    client.replyMessage(replyToken, message)
}

module.exports.message_help = message_help