/* const User = require("./model/user").User

async function print() {
    let user = await User.load('U3c5199b84bae262c48381504168fe4b2')
    console.log("userId : " + user.userId)
    console.log("state : " + user.state)
    console.log("menuList : " + user.menuList)
    console.log(user)
}
print() */

const Client = require('@line/bot-sdk').Client
const config = {
    channelAccessToken: 'n/FsngKwPgrLhglag8dqI994iPBAFGlWAZ049Hiq1F5tsguZbDxksyWj3zskC0TFsCOCGraTNp0yg7YLdTm+wOZeDuUKNuu/2Xvz9azWjqMyKy3t+68MjDEK50ytYmjcQFImAvBJ5hC1ZayLOqHcSwdB04t89/1O/w1cDnyilFU=',
    channelSecret: '3937dd366ad9ae26ec016a2abc831513'
}
client = new Client(config)
client.getProfile('U3c5199b84bae262c48381504168fe4b2')
.then(profile => {
    console.log(profile)
})