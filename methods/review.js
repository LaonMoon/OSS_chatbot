import {postReviews, getReviewsRanks,getReviewsRanksDescription} from "./rank/rankController";
//import compression from "compression"
import methodOverride from "method-override"
const User = require('../models/user').User
//import cors from "corsf"



const line = require('@line/bot-sdk');
const middleware = require('@line/bot-sdk').middleware

const https = require("https")

const client = new line.Client({
    channelAccessToken: process.env.TOKEN
})

let rankstate=1;
let reviewstate = 1;
let showreviewstate=1;

const errormsg = {"type": "text", "text": "죄송합니다. 오류가 발생했습니다. 잠시후에 사용해 주십시오."};

async function review_Handler(event) {
    try {

        const userId = event.source.userId
        let user = await User.load(userId)
        const state = user.state
        console.log(state)
        switch(state) {
            case ('following'): {
                const m = event.message.text;
                if(m=='오늘 학식 평점 어때')
                    showrank(event,user);
                else if(m=='오늘 학식 후기 어때')
                    showreview(event,user);
                else if(m=='리뷰 작성')
                    reply(event,user);
                break;
            }
            case ('review_showrank') : {showrank2(event,user); break;}
            case ('review_showreview') : {showreview2(event, user); break;}
            case ('review_reply') : {reply2(event,user); break;}
            case ('review_reply2') : {reply3(event,user); break;}
            case ('review_reply3') : {reply4(event,user); break;}

        }

    }
    catch(err) {
        console.log(err);
    }
}


function def(event){
    try {
        const rpT = event.replyToken;
        const defmsg = {"type": "text", "text": "잘못 입력하셨습니다. 앞선 안내문에 따라 정확하게 입력해주십시오."};

        client.replyMessage(rpT, defmsg);
    }catch(err){
        console.log("show rank error");
        console.log(err);
        client.replyMessage(rpT, errormsg);
    }

}
const showrank=async(event,user)=>{
    try{
        const rpT = event.replyToken;
        const showrankmsg = {"type": "text", "text": "학식 평점을 보여드리겠습니다.\n먼저, menu의 종류를 입력해주세요(소반,특식,석식)"};

        user.state="review_showrank";
        await user.save();
        await client.replyMessage(rpT, showrankmsg);

    } catch(err){
        const rpT = event.replyToken;
        console.log("show rank error");
        console.log(err);
        client.replyMessage(rpT, errormsg);

         
    }
}

const showrank2=async(event,user)=>{
    try {
        const rpT = event.replyToken;
        const menu = event.message.text;
        if(menu=='처음으로'){
            const changemsg = {"type": "text", "text": "평점 확인 기능을 종료합니다."};
            client.replyMessage(rpT, changemsg);
            user.state = 'following'
            await user.save()
        }
        else if(!(menu=='소반' || menu=='특식' || menu=='석식'))
        {

            const typemissmsg = {"type": "text", "text": "잘못 입력하셨습니다.\n 앞선 안내문에 따라 소반,특식,석식 중에서 입력해주십시오." +
                    "\n(만약 평점 확인 기능을 종료하고 싶다면 '처음으로'라고 입력해주세요)"};
            client.replyMessage(rpT, typemissmsg);
        }
        else{
            const reviewdata = await getReviewsRanks(menu);
            const dataString = JSON.stringify(reviewdata);
            let messages = []
            if (reviewdata[0]['sum(menu_rank)/count(ID)'] == null) {
                messages.push({type : 'text', text : "리뷰가 없습니다. 리뷰를 입력해주세요"})
            }
            else {
                for (let row of reviewdata) {
                    let i = 0;
                    const message = {
                        type: 'text',
                        text: "사용자들이 입력한 점수의 평균은" + row['sum(menu_rank)/count(ID)'] + "입니다"
                    }

                    messages.push(message)
                }
            }
            user.state = 'following'
            await user.save()
            client.replyMessage(rpT, messages);
            console.log(user.state);
        }
    }catch(err){
        const rpT = event.replyToken;
        console.log(err);
        console.log("show rank2 error");
        client.replyMessage(rpT, errormsg);



    }
}


const showreview=async(event,user)=>{
    try {
        const rpT = event.replyToken;
        const showreviewmsg = {"type": "text", "text": "학식 리뷰를 보여드리겠습니다.\n먼저, menu의 종류를 입력해주세요(소반,특식,석식)"};

        await client.replyMessage(rpT, showreviewmsg);
        user.state = 'review_showreview'
        await user.save()
        showreviewstate = 2;

    }catch(err){
        const rpT = event.replyToken;
        console.log("show review1 error");
        client.replyMessage(rpT, errormsg);
    }

}

const showreview2=async(event,user)=>{
    try {
        const rpT = event.replyToken;
        const menu = event.message.text;
        if(menu=='처음으로'){
            const changemsg = {"type": "text", "text": "후기 확인 기능을 종료합니다."};
            client.replyMessage(rpT, changemsg);
            user.state = 'following'
            await user.save()
        }
        else if(!(menu=='소반' || menu=='특식' || menu=='석식'))
        {
            const typemissmsg = {"type": "text", "text": "잘못 입력하셨습니다.\n 앞선 안내문에 따라 소반,특식,석식 중에서 입력해주십시오." +
                    "\n(만약 후기 확인 기능을 종료하고 싶다면 '처음으로'라고 입력해주세요)"};
            client.replyMessage(rpT, typemissmsg);
        }
        else {

            const showreviewdata = await getReviewsRanksDescription(menu);
            const dataString = JSON.stringify(showreviewdata);

            let messages = []
            let i = 1;
            let j = 0;
            if(showreviewdata.length == 0){
                messages.push({type : 'text', text : "리뷰가 없습니다. 리뷰를 입력해주세요"})
            }
            else {
                for (let row of showreviewdata) {
                    let ii = String(i);

                    const message = {
                        type: 'text',
                        text: ii + "번째 후기\n" + "메뉴 rank : " + row.menu_rank + "\n" + "메뉴 후기 : " + row.menu_description
                    }

                    if(j<5){messages.push(message)}
                    i++
                    j++
                }
            }
            await client.pushMessage(user.userId, messages);
            user.state = 'following';
            await user.save();
            console.log("show reivew2 sucess");
        }
    }catch(err){
        
        const rpT = event.replyToken;
        console.log("show review2 error");
        client.replyMessage(rpT, errormsg);

    }
}

async function reply(event,user) {
    try {
        const rpT = event.replyToken;
        const firstmsg = {"type": "text", "text": "학식 리뷰를 입력해주세요.\n먼저, menu의 종류를 입력해주세요(소반,특식,석식)"}
        client.replyMessage(rpT, firstmsg);
        console.log("reply one sucess");
        user.state = 'review_reply'
        await user.save()
        reviewstate = 2;
    }catch(err){
        const rpT = event.replyToken;
        console.log("reply1 error");
        console.log(err);

        client.replyMessage(rpT, errormsg);
    }
}

async function reply2(event,user) {
    try {
        const rpT = event.replyToken;
        const menu2 = event.message.text;
        if(!(menu2=='소반' || menu2=='특식' || menu2=='석식'))
        {
            const typemissmsg = {"type": "text", "text": "현재, 리뷰 작성 중 메뉴의 종류를 입력 중입니다.\n앞선 안내문에 따라 소반,특식,석식 중에서 입력해주십시오." +
                    "\n만약 리뷰 작성을 종료하고 싶다면 '처음으로' 라고 입력해주세요"};
            client.replyMessage(rpT, typemissmsg);
        } else if(menu2=='처음으로'){
            const changemsg = {"type": "text", "text": "리뷰 작성을 종료합니다."};
            client.replyMessage(rpT, changemsg);
            user.state = 'following'
            await user.save()
        }
        else {

            global.menu2 = menu2;
            const secondmsg = {"type": "text", "text": "입력해주셔서 감사합니다.\n다음으로, menu의 별점를 0부터5까지 정수형으로 입력하세요"}
            client.replyMessage(rpT, secondmsg);
            console.log("reply two sucess");

            user.state = 'review_reply2'
            await user.save()
        }
    }catch(err){
        const rpT = event.replyToken;
        console.log("reply2 error");
        console.log(err);

        client.replyMessage(rpT, errormsg);
    }
}

async function reply3(event,user) {
    try {
        const rpT = event.replyToken;
        const menu_rank = parseInt(event.message.text); //menu_rank받아온다.

        if(!(menu_rank=='0' || menu_rank=='1' || menu_rank=='2'||menu_rank=='3'||menu_rank=='4'||menu_rank=='5')){
            const rankmissmsg = {"type": "text", "text": "잘못 입력하셨습니다.\n현재, 리뷰 작성 중 별점을 입력하는 부분입니다." +
                    "\n앞선 안내문에 따라 0,1,2,3,4,5 중에서 정수형으로 입력해주세요\n만약 리뷰 작성을 종료하고 싶다면 '처음으로' 라고 입력해주세요"};
            client.replyMessage(rpT, rankmissmsg);
        }
        else if(menu_rank=='처음으로'){
            const changemsg = {"type": "text", "text": "리뷰 작성을 종료합니다."};
            client.replyMessage(rpT, changemsg);
            user.state = 'following'
            await user.save()
        }else{
        global.menu_rank = menu_rank;

        const thirdmsg = {"type": "text", "text": "입력해주셔서 감사합니다.\nmenu에 대한 text후기를 남겨주세요"}
        client.replyMessage(rpT, thirdmsg);
        console.log("reply three sucess");
        reviewstate = 4;
        user.state = 'review_reply3'
        await user.save()
        }
    }catch(err){
        const rpT = event.replyToken;
        console.log("reply3 error");
        console.log(err);
        client.replyMessage(rpT, errormsg);
    }
}

async function reply4(event,user) {
    try {
        const rpT = event.replyToken;
        const menu_description = event.message.text; //menu_description받아온다.
        if(menu_description=='리뷰 작성' || menu_description=='오늘 학식 후기 어때'||menu_description=='오늘 학식 평점 어때'){
            const rankmissmsg = {"type": "text", "text": "잘못 입력하셨습니다.\n현재, 리뷰 작성 중 text후기를 입력하는 부분입니다\n만약 리뷰 작성을 종료하고 싶을 경우, '처음으로'를 입력해주세요"};
            client.replyMessage(rpT, rankmissmsg);
        }
        else if(menu_description=='처음으로'){
            const changemsg = {"type": "text", "text": "리뷰 작성을 종료합니다."};
            client.replyMessage(rpT, changemsg);
            user.state = 'following'
            await user.save()
        }
        else {
            const fourthmsg = {"type": "text", "text": "학식 리뷰를 입력해주셔서 감사합니다."}
            client.replyMessage(rpT, fourthmsg);
            console.log("reply fourth sucess");

            user.state = 'following'
            await user.save()
            postReviews(menu2, menu_rank, menu_description);
        }
    }catch(err){
        /*const rpT = event.replyToken;
        console.log("reply4 error");
        console.log(err);
        client.replyMessage(rpT, errormsg);*/
    }
}

module.exports.review_Handler=review_Handler;