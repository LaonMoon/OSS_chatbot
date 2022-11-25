const MySQL = require("../methods/database").MySQL

class User {
    //private
    #userId = ""
    #state = ""
    #menuList = []

    //public
    constructor(_userId) {
        this.#userId = _userId
        this.#state = "following"
        this.save()
    }
    //getter
    get_userId() {
        return this.#userId
    }
    get_menuList() {
        return this.#menuList
    }
    get_state() {
        return this.#state
    }
    //setter
    set_State(_state) {
        this.#state = _state
    }
    //methods
    AddMenuList(menu) {
        this.#menuList.push(menu)
    }
    DelMenu(menu) {
        let idx = this.#menuList.indexOf(menu)
    }
    save() {
        try {
            let mysql = MySQL()
            let sql = `INSERT INTO user (userId, state) VALUES (${this.#userId}, ${this.#state});`
            let result = mysql.Sql(sql)
            return result
        }
        catch {
            console.log(err)
        }
    }
    //static
    static Load(userId) {
        try {
            let mysql = new MySQL()
            let sql = `SELECT * FROM user where userId = '${userId}';`
            let results = mysql.Execute(sql)
            let user = new User(results[0]['userId'])
            user.SetState(results[0]['state'])
            sql = `SELECT * FROM user_menulist where userId = '${userId}';`
            results = mysql.Execute(sql)
            for (let idx in results) {
                user.AddMenuList(results[idx]['menu'])
            }
            return user
        }
        catch(err) {
            console.log(err)
        }
    }
}

module.exports.User = User