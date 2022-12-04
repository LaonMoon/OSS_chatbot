const line = require('@line/bot-sdk');
const TOKEN = process.env.TOKEN || 'n/FsngKwPgrLhglag8dqI994iPBAFGlWAZ049Hiq1F5tsguZbDxksyWj3zskC0TFsCOCGraTNp0yg7YLdTm+wOZeDuUKNuu/2Xvz9azWjqMyKy3t+68MjDEK50ytYmjcQFImAvBJ5hC1ZayLOqHcSwdB04t89/1O/w1cDnyilFU='


const client = new line.Client({
    channelAccessToken: TOKEN
});

const User = require('../models/user').User
const MenuData = require('../models/menudata').MenuData

var User_funcId_Arr = [];
var User_Id_Arr = [];

let IsInputOk = function (InputTime) {
	let alarmdate = InputTime;
	let time = Number(alarmdate.substring(0,2));
    let minute = Number(alarmdate.substring(2,4));
	let year = new Date().getFullYear()

	if(desDay = new Date(year, time, minute) != NaN){
		return true;
	}
	else{
		return false;
	}
};

function timerFunc(dateTime, user){
    let time = Number(dateTime.substring(0,2));
    let minute = Number(dateTime.substring(2,4));
    let today = new Date()
    let year = today.getFullYear()
    let month = today.getMonth()
    let day = today.getDate()
  
    let oprDate = new Date(year, month, day, time, minute); //동작을 원하는 시간의 Date 객체를 생성합니다.
    let nowDate = new Date();
  
    let timer = oprDate.getTime() - nowDate.getTime(); //동작시간의 밀리세컨과 현재시간의 밀리세컨의 차이를 계산합니다.
    let offset = 32400000;
    timer = timer - offset;
    if(timer < 0){ //타이머가 0보다 작으면 함수를 종료합니다.
        return ("Error")
    }
    else{
        let daytime = 86400000;
        setTimeout(async () => {
            let intervalId;
            //clearInterval(intervalId);
            console.log("Alarm!!");
            let menudata = await MenuData.load('1500')
            let pushmsg = `딩동! 오늘의 메뉴는 “${menudata.data[0].lunch_A}, ${menudata.data[0].lunch_B}, ${menudata.data[0].dinner}”입니다! 어서 가서 먹어볼까요?`;
            client.pushMessage(user, pushmsg);
            let user_ind = User_Id_Arr.indexOf(user)
            if (user_ind != -1 ){
              intervalId = User_funcId_Arr[user_ind]
              clearInterval(intervalId)
              delete User_funcId_Arr[user_ind];
              delete User_Id_Arr[user_ind];
            }
            
            intervalId = setInterval(async () => {
              console.log(new Date())
            let menudata = await MenuData.load('1500')
            let pushmsg = `딩동! 오늘의 메뉴는 “${menudata.data[0].lunch_A}, ${menudata.data[0].lunch_B}, ${menudata.data[0].dinner}”입니다! 어서 가서 먹어볼까요?`;
              client.pushMessage(user, pushmsg);
          }, daytime);
          User_funcId_Arr.push({UserId : user, FuncId : intervalId});
          User_Id_Arr.push(user);
        } , timer);
        return ("Alarm seting!")
    }
}

async function Alarm_Handler (eventObj) {
    let InputUserId = eventObj.source.userId;
    let repTok = eventObj.replyToken;
    let user = await User.load(InputUserId);
    if (user.state == "following"){
        // 알람 설정 UI reply
        let Repmsg  = "입력 형식을 지정해주세요.\n 1) 오전 @시 2) 오후 @시 3) 사용자 입력 ex) 00:00"
        let examMsg = "1, 2, 3 중 선택하지 않을시 에러 발생"
        const message = [{
            type: 'text',
            text: Repmsg,
          },
        {
            type: 'text',
            text: examMsg,
        }
        ];
        client.replyMessage(repTok, message)
        user.state == "alarmSetting"
    }
    else if (user.state == "alarmSetting"){
        let str = eventObj.message.text
        if (/[1-3]/.test(str)){
            let Repmsg;
            switch (str){
                case '1':
                    Repmsg = "오전 @시 형태로 입력해주세요. ex) 오전 9시";
                    break;
                case '2':
                    Repmsg = "오후 @시 형태로 입력해주세요. ex) 오후 1시";
                    break;
                case '3':
                    Repmsg = "구체적인 시간을 다음의 형태로 입력해주세요 00:00 or 0000 ex) 09:27";
                    break;
            }
            const message = {
                type: 'text',
                text: Repmsg,
          };
            client.replyMessage(repTok, message)
            user.state == "alarmSet"
        }
        else{
            let ErrMsg = "Alarm setting Error!"
            const message = {
                type: 'text',
                text: ErrMsg,
          };
            client.replyMessage(repTok, message)
            user.state == "following"
        }
    }
    else if (user.state == "alarmSet"){
        let str = eventObj.message.text
        let alarmdate;
    if (/("오전")+/.test(str)){
        const words = str.match(/([0-1]?[0-9]시)+/)
        for (let word of words){
            alarmdate = word;
        }
    }
    else if(/("오후")+/.test(str)){
        const words = str.match(/([0-1]?[0-9]시)+/)
        for (let word of words){
            alarmdate = word;
        }
    }
    else{
        const words = str.match(/\d{2}:?\d{2}/)
        for (let word of words){
            if (/[0-9][0-9]:?[0-9][0-9]/.test(word)){
              alarmdate = word;
            }
        }
        if(/[0-9][0-9]:[0-9][0-9]/.test(alarmdate)){
          alarmdate = alarmdate.substring(0,2) + alarmdate.substring(3,5);
        }
    }
        let Errmsg;
        let Repmsg;

        if(!(IsInputOk(alarmdate))){
            Errmsg = "Alarm set Error";
            const message = {
                type: 'text',
                text: Errmsg
              };
            client.replyMessage(repTok, message)
            user.state == "following"
        }
        
        let retm = timerFunc(alarmdate, InputUserId);
        console.log(retm);
        if(retm == "Error"){
            Errmsg = "TimeSetError"
            const message = {
                type: 'text',
                text: Errmsg
              };
            client.replyMessage(repTok, message)
            user.state == "following"
        }
        else{
          Repmsg = "좋아요, 그럼 매일  “" + alarmdate.substring(0,2) + "시” “" + alarmdate.substring(2,4) + "분”에 오늘의 식단을 알려드릴게요"

          const message = {
              type: 'text',
              text: Repmsg
            };
          client.replyMessage(repTok, message)
          user.state == "following"
        }
    }
}

module.exports.Alarm_Handler = Alarm_Handler