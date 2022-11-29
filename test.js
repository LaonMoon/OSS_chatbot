const User = require("./models/user").User
const MenuData = require('./models/menudata').MenuData

async function print() {
    let user = await User.load('U3c5199b84bae262c48381504168fe4b2')
    console.log("userId : " + user.userId)
    console.log("state : " + user.state)
    console.log("menuList : " + user.menuList)
    console.log(user)
}
async function print2(){
    let data = await dataLoader.GetMenuData()
    data = await dataLoader.ProcessData(data)
    await dataLoader.SaveData(data)
}
async function print3() {
    let menudata = await MenuData.load('2022-11-29')
    console.log(menudata.data)
}
print()
//print2()
print3()