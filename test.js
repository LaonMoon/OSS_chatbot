const User = require("./models/user").User

async function print() {
    let user = await User.load('U3c5199b84bae262c48381504168fe4b2')
    console.log("userId : " + user.userId)
    console.log("state : " + user.state)
    console.log("menuList : " + user.menuList)
    console.log(user)
}
print()