const User = require("./models/user").User
const dataLoader = require("./methods/dataLoader")

async function print() {
    let user = await User.load('U3c5199b84bae262c48381504168fe4b2')
    console.log("userId : " + user.userId)
    console.log("state : " + user.state)
    console.log("menuList : " + user.menuList)
    console.log(user)
}
async function print2(){
    let data = await dataLoader.GetMenuData()
    console.log(data)
    data = await dataLoader.ProcessData(data)
    console.log(data)
}
print()
print2()