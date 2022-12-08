const User = require("./models/user").User
const MenuData = require('./models/menudata').MenuData

// Example for user class
async function printUser(userId) {
    let user = await User.load(userId)
    console.log("userId : " + user.userId)
    console.log("state : " + user.state)
    console.log("menuList : " + user.menuList)
    console.log("buffer : " + user.buffer)
    console.log("----------------------------------------------------------------------------------------")
}

// Example for menudata class
async function printMenuData(dates) {
    const menudata = await MenuData.load(dates)
    for(let data of menudata.data) {
        console.log("date : " + data.date)
        console.log("lunch_A : " + data.lunch_A)
        console.log("lunch_B : " + data.lunch_B)
        console.log("dinner : " + data.dinner)
        console.log("----------------------------------------------------------------------------------------")

    }
}
async function saveMenuData() {
    const raw = await MenuData.GetMenuData()
    console.log(raw)
    const data = await MenuData.ProcessData(raw)
    console.log(data)
    let menudata = new MenuData(data)
    await menudata.save()
}

async function saveUser(userId) {
    let user = new User(userId)
    await user.save()
}

async function saveReivew() {
    
}

const userId = 'U3c5199b84bae262c48381504168fe4b2'
printUser(userId)

const dates = ['2022-12-06', '2022-12-07']
printMenuData(dates)

//saveUser('abcd')

// saveMenuData()