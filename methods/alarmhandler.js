const line = require('@line/bot-sdk');
const TOKEN = process.env.TOKEN

const client = new line.Client({
    channelAccessToken: TOKEN
});

const User = require('../models/user').User
const MenuData = require('../models/menudata').MenuData

// 유저가 설정한 알람 함수의 Id를 저장하기 위한 배열
var User_funcId_Arr = [];
var User_Id_Arr = [];

// 유저 데이터 가져오기
async function getUser(userId) {
    let user = await User.load(userId);
    return user;
}

// 유저 데이터 저장
async function saveUser(user){
    await user.save();
    return true;
}

// 메뉴 데이터 가져오기
async function getMenuData(Data){
    let menudata = await MenuData.load(Data)
    return menudata;
}

// 입력의 유효성 검사
let IsInputOk = function (InputTime) {
	let alarmdate = InputTime;
	let time = Number(alarmdate.substring(0,2));
    let minute = Number(alarmdate.substring(2,4));
	let year = new Date().getFullYear()
    let desDay;
    
	if(desDay = new Date(year, time, minute) != NaN){
		return true;
	}
	else{
		return false;
	}
};

// 알람 세팅
function SetingAlarm (TargetTime, user) {
    setTimeout(async () => {
        let daytime = 86400000;
        console.log("Alarm!!");
        let Data = GetDate();
        console.log(Data)
        getMenuData([Data]).then( (menudata) => {
            let pushhaed = '딩동! 오늘의 메뉴는 “'
            let pushtail = '”입니다! 어서 가서 먹어볼까요?';
            const message = [{
                type: 'text',
                text: pushhaed,
            },
            {
                type: 'text',
                text: `${menudata.data[0].lunch_A}`,
            },
            {
                type: 'text',
                text: `${menudata.data[0].lunch_B}`,
            },
            {
                type: 'text',
                text: `${menudata.data[0].dinner}`,
            },
            {
                type: 'text',
                text: pushtail,
            }];
            client.pushMessage(user, message);
            let intervalId = (setInterval(async () => {
                    console.log(new Date())
                    let DayData = GetDate();
                    getMenuData([DayData]).then( (menudata) => {
                        let pushhaed = '딩동! 오늘의 메뉴는 “'
                        let pushtail = '”입니다! 어서 가서 먹어볼까요?';
                        const message = [{
                            type: 'text',
                            text: pushhaed,
                        },
                        {
                            type: 'text',
                            text: `${menudata.data[0].lunch_A}`,
                        },
                        {
                            type: 'text',
                            text: `${menudata.data[0].lunch_B}`,
                        },
                        {
                            type: 'text',
                            text: `${menudata.data[0].dinner}`,
                        },
                        {
                            type: 'text',
                            text: pushtail,
                        }];
                        client.pushMessage(user, message);
                    })      
                }, daytime));
            SetUserFunc(user, intervalId)
        });
    }, TargetTime)
}

// 유저의 함수 저장
function SetUserFunc(user, intervalId) {
    User_funcId_Arr.push({UserId : user, FuncId : intervalId});
    User_Id_Arr.push(user);
}

// 메뉴 Key 설정
function GetDate(){
    let today = new Date();
    let todayms = today.getTime();
    todayms = todayms + 32400000;

    let KoreaToday = new Date(todayms);
    let year = KoreaToday.getFullYear();
    let month = KoreaToday.getMonth();
    let day = KoreaToday.getDate();
    month = month + 1;

    let Targetmonth = (month < 10) ? `0${month}` : String(month)
    let Targetday = (day < 10) ? `0${day}` : String(day)
   
    let Target = `${year}-${Targetmonth}-${Targetday}`
    console.log(Target)
    return Target;     
}

// 타이머 설정 함수
function timerFunc(dateTime, user){
    let time = Number(dateTime.substring(0,2));
    let minute = Number(dateTime.substring(2,4));
    let today = new Date()
    let todayms = today.getTime();
    let offset = 32400000;
    todayms = todayms + offset;

    let KoreaToday = new Date(todayms);


    let year = KoreaToday.getFullYear()
    let month = KoreaToday.getMonth()
    let day = KoreaToday.getDate()
  
    let oprDate = new Date(year, month, day, time, minute); //동작을 원하는 시간의 Date 객체를 생성합니다.
  
    let timer = oprDate.getTime() - KoreaToday.getTime(); //동작시간의 밀리세컨과 현재시간의 밀리세컨의 차이를 계산합니다.
    if(timer < 0){
        let oprDatems = oprDate.getTime() + 86400000;
        timer = oprDatems - KoreaToday.getTime();
    }
    
    if(timer < 0){ //타이머가 0보다 작으면 함수를 종료합니다.
        return ("Error")
    }
    else{
        let user_ind = User_Id_Arr.indexOf(user) // 유저 함수가 있는지 확인 후, 있으면 그 함수 삭제 후 재설정
        if (user_ind != -1 ){
            const intervalId = User_funcId_Arr[user_ind].FuncId
            clearInterval(intervalId)
            delete User_funcId_Arr[user_ind];
            delete User_Id_Arr[user_ind];
        }
        SetingAlarm(timer, user);
         return ("Alarm seting!")
    }
}

// 메인 핸들러
async function Alarm_Handler (eventObj) {
    let InputUserId = eventObj.source.userId;
    let repTok = eventObj.replyToken;
    let alarmdate = ""

    getUser(InputUserId).then (async (user) => {
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
            user.state = "alarm_AlarmSetting"
            console.log(user.state);
            saveUser(user).then( isUserSave => {
                if(isUserSave){
                    console.log ("AlarmHandler_UserIdSave!!");
                    return;
                }
            })
        }
        else if (user.state == "alarm_AlarmSetting"){
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
                user.state = "alarm_AlarmSet"

                saveUser(user).then( isUserSave => {
                    if(isUserSave){
                        console.log ("AlarmHandler_UserIdSave!!");
                        return;
                    }
                })
            }
            else {
                let ErrMsg = "입력 범위를 벗어났습니다!"
                const message = {
                    type: 'text',
                    text: ErrMsg,
                };
                client.replyMessage(repTok, message)
                user.state = "following"
                saveUser(user).then( isUserSave => {
                    if(isUserSave){
                        console.log ("AlarmHandler_UserIdSave!!");
                        return;
                    }
                })
            }
        }
        else if (user.state == "alarm_AlarmSet"){
            let str = eventObj.message.text

            if (/오전.+/.test(str)){
                const words = str.match(/([0-1]?[0-9]시)+/)
                for (let word of words){
                    if(/[0-9]시/.test(word)){
                        alarmdate =`0${word.substring(0,1)}00`
                    }
                else if (/[0-1][0-9]시/.test(word)){
                    let temptime = Number(word.substring(0,2));
                        temptime;
                        if(temptime > 12){
                            temptime = 12;
                        }
                    alarmdate =`${temptime}00`
                }
                }
            }
            else if(/오후.+/.test(str)){
                const words = str.match(/([0-1]?[0-9]시)+/)
                for (let word of words){
                    if(/[0-9]시/.test(word)){
                        let temptime = Number(word.substring(0,1));
                        temptime = temptime + 12;
                        alarmdate =`${temptime}00`
                    }
                    else if (/[0-1][0-9]시/.test(word)){
                        let temptime = Number(word.substring(0,2));
                        temptime = temptime + 12;
                        if(temptime > 24){
                            temptime = 24;
                        }
                        alarmdate =`${temptime}00`
                    }
                }
            }
            else if(/\d{2}:?\d{2}/.test(str)) {
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
            else{
                let Errmsg = "Alarm set Error";
                    const message = {
                        type: 'text',
                        text: Errmsg
                    };
                client.replyMessage(repTok, message)
                user.state = "following"
                await saveUser(user).then( isUserSave => {
                    if(isUserSave){
                        console.log ("AlarmHandler_UserIdSave!!");
                        return;
                    }
                })
                return
            }
        let Errmsg;
        let Repmsg;

        if(!(IsInputOk(alarmdate))){
            Errmsg = "유효하지 않은 입력입니다!";
            const message = {
                type: 'text',
                text: Errmsg
              };
            client.replyMessage(repTok, message)
            user.state = "following"
            saveUser(user).then( isUserSave => {
                if(isUserSave){
                    console.log ("AlarmHandler_UserIdSave!!");
                    return;
                }
            })
        }
        
        let retm = timerFunc(alarmdate, InputUserId);
        console.log(retm);
        if(retm == "Error"){
            Errmsg = "시간 입력이 잘못되었습니다!"
            const message = {
                type: 'text',
                text: Errmsg
              };
            client.replyMessage(repTok, message)
            user.state = "following"
            saveUser(user).then( isUserSave => {
                if(isUserSave){
                    console.log ("AlarmHandler_UserIdSave!!");
                    return;
                }
            })
        }
        else{
          Repmsg = "좋아요, 그럼 매일  “" + alarmdate.substring(0,2) + "시” “" + alarmdate.substring(2,4) + "분”에 오늘의 식단을 알려드릴게요"

          const message = {
              type: 'text',
              text: Repmsg
            };
            client.replyMessage(repTok, message)
            user.state = "following"
            saveUser(user).then( isUserSave => {
                if(isUserSave){
                    console.log ("AlarmHandler_UserIdSave!!");
                    return;
                }
            })
        }        
        }
    })
}

module.exports.Alarm_Handler = Alarm_Handler