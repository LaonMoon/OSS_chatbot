const db = require("../methods/database")

class User {
    // private
    #userId = ""
    #state = ""
    #alarmTime = 0
    #menuList = []

    // constructor
    constructor(userId) {
        this.userId = userId
        this.state = "following"
        this.alarmTime = ""
        this.menuList = []
    }

    // getter
    get userId() {
        return this.#userId
    }
    get state() {
        return this.#state
    }
    get alarmTime() {
        return this.#alarmTime
    }
    get menuList() {
        return this.#menuList
    }

    // setter
    set userId(userId) {
        this.#userId = userId
    }
    set state(state) {
        this.#state = state
    }
    set alarmTime(alarmTime) {
        this.#alarmTime = alarmTime
    }
    set menuList(menuList) {
        this.#menuList = menuList
    }

    // methods
    AddMenuList(menu) {
        this.#menuList.push(menu)
    }
    DelMenu(menu) {
        const idx = this.#menuList.indexOf(menu)
        this.#menuList.splice(idx, 1)
    }
    async save() {
        try {
            let sql = `SELECT userId FROM user where userId = '${this.userId}'`
            let result = await db.Execute(sql)

            // 
            if (result == []) {
                sql = `INSERT INTO user (userId, state) VALUES ('${this.userId}', '${this.state}');`
                result = await db.Execute(sql)
            }
            else {
                sql = `UPDATE user SET state = '${this.state}'`
                sql = `SELECT * FROM user_menulist where userId = '${userId}';`
                result = await db.Execute(sql)
                for (let idx in result) {
                    await user.AddMenuList(result[idx]['menu'])
                }
            }
            return result
        }
        catch(err) { throw err }
    }
    async delete() {
        try {
            const sql = `DROP FROM user WHERE userId = '${this.userId}'`
            const result = await db.Execute(sql)
            return result
        }
        catch (err) { throw err }
    }
    
    // static
    static async load(userId) {
        try {
            let sql = `SELECT * FROM user where userId = '${userId}';`
            let result = await db.Execute(sql)
            let user = new User(result[0]['userId'])
            user.#state = result[0]['state']
            user.#alarmTime = result[0]['alarmTime']
            sql = `SELECT * FROM user_menulist where userId = '${userId}';`
            result = await db.Execute(sql)
            for (let idx in result) {
                await user.AddMenuList(result[idx]['menu'])
            }
            return user
        }
        catch(err) {
            throw err
        }
    }
}

module.exports.User = User