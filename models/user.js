const db = require("../methods/database")

class User {
    /*
        - User is a class for handling data about user with database.
        - Attributs: userId(pk), state, alarmTime, buffer
        - menuList table has fk representing userId
    */

    // private
    #userId = ""
    #state = ""
    #alarmTime = 0
    #menuList = []
    #buffer = ""

    // constructor
    constructor(userId) {
        this.#userId = userId
        this.#state = "following"
        this.#alarmTime = ""
        this.#menuList = []
        this.#buffer = ""
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
    get buffer() {
        return this.#buffer
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
    set buffer(buffer) {
        this.#buffer = buffer
    }

    // methods
    AddMenu(menu) {
        this.#menuList.push(menu)
    }
    DelMenu(menu) {
        const idx = this.#menuList.indexOf(menu)
        this.#menuList.splice(idx, 1)
    }
    async save() {
        /*
            save provide you to save this object to database.
        */
        try {
            let sql = `SELECT userId FROM user where userId = '${this.userId}'`
            let result = await db.Execute(sql)

            // If there's no user matching this object's userId in database, then insert a new record.
            if (result.length == 0) {
                sql = `INSERT INTO user (userId, state) VALUES ('${this.userId}', '${this.state}');`
                result = await db.Execute(sql)
            }
            // If there's already an user matching this object's userId in database, update the record.
            else {
                sql = `UPDATE user SET state = '${this.state}'`
                result = await db.Execute(sql)
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
    static async isIn(userId) {
        /*
            Returns if there is any user matching userId in database.(true/false)
        */
        try {
            let sql = `SELECT userId FROM user where userId = '${this.userId}'`
            let result = await db.Execute(sql)

            if (result.length == 0) {
                return false
            }
            else {
                return true
            }
        }
        catch(err) {
            throw err
        }
    }
    static async load(userId) {
        /*
            Input: userId (pk in database)
            Return: An User instance matching userId
        */
        try {
            let sql = `SELECT * FROM user where userId = '${userId}';`
            let result = await db.Execute(sql)
            let user = new User(result[0]['userId'])
            user.#state = result[0]['state']
            user.#alarmTime = result[0]['alarmTime']
            user.#buffer = result[0]['buffer']
            sql = `SELECT * FROM user_menulist where userId = '${userId}';`
            result = await db.Execute(sql)
            for (let row of result) {
                user.AddMenu(row.menu)
            }
            return user
        }
        catch(err) {
            throw err
        }
    }
}

module.exports.User = User