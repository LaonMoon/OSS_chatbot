const User = require("./models/user").User
const MenuData = require('./models/menudata').MenuData

// Example for user class
async function printUser(userId) {
    let user = await User.load(userId)
    console.log("userId : " + user.userId)
    console.log("state : " + user.state)
    console.log("menuList : " + user.menuList)
    console.log("----------------------------------------------------------------------------------------")
}

// Example for menudata class
async function printMenuData(date) {
    let menudata = await MenuData.load(date)
    console.log("date : " + menudata.data[0].date)
    console.log("lunch_A : " + menudata.data[0].lunch_A)
    console.log("lunch_B : " + menudata.data[0].lunch_B)
    console.log("dinner : " + menudata.data[0].dinner)
    console.log("----------------------------------------------------------------------------------------")

}
async function saveMenuData() {
    const raw = await MenuData.GetMenuData()
    console.log(raw)
    const data = await MenuData.ProcessData(raw)
    console.log(data)
    let menudata = new MenuData(data)
    await menudata.save()
}

const userId = 'U3c5199b84bae262c48381504168fe4b2'
printUser(userId)

const date = '2022-12-01'
printMenuData(date)

// saveMenuData()