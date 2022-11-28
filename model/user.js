const db = require("../methods/database")

class User {
    //private
    #userId = ""
    #state = ""
    #alarmTime = 0
    #menuList = []
    //public
    constructor(userId) {
        this.userId = userId
        this.state = "following"
        this.menuList = []
    }
    //getter
    get userId() {
        return this.#userId
    }
    get state() {
        return this.#state
    }
    get menuList() {
        return this.#menuList
    }
    //setter
    set userId(userId) {
        this.#userId = userId
    }
    set state(state) {
        this.#state = state
    }
    set menuList(menuList) {
        this.#menuList = menuList
    }
    //methods
    AddMenuList(menu) {
        this.#menuList.push(menu)
    }
    DelMenu(menu) {
        const idx = this.#menuList.indexOf(menu)
        this.#menuList.splice(idx, 1)
    }
    async save() {
        try {
            let sql = `INSERT INTO user (userId, state) VALUES ('${this.userId}', '${this.state}');`
            let result = await db.Execute(sql)
            return result
        }
        catch(err) {
            console.log(err)
        }
    }
    //static
    static async load(userId) {
        try {
            let sql = `SELECT * FROM user where userId = '${userId}';`
            let result = await db.Execute(sql)
            let user = new User(result[0]['userId'])
            user.#state = result[0]['state']
            sql = `SELECT * FROM user_menulist where userId = '${userId}';`
            result = await db.Execute(sql)
            for (let idx in result) {
                await user.AddMenuList(result[idx]['menu'])
            }
            return user
        }
        catch(err) {
            console.log(err)
        }
    }
}

module.exports.User = User