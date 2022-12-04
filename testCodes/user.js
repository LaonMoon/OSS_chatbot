require("dotenv").config();
import mysql from "mysql2/promise"
const pool = mysql.createPool({
    host: 'localhost',
    user:'root',
    port: '3306',
    password: 'Abc7878!',
    database: 'osschatbotdb'
});

async function Execute(sql) {
    const conn =  await pool.getConnection()
    if(conn)
        console.log("db conn")
    try {
        const result = await conn.query(sql)
        return result
    }
    catch (err) {
        throw new Error(err)
    }
    finally {
        conn.release()
    }
}

class User {
    // private
    #userId = "0"
    #state = ""
    #alarmTime = 0
    #menuList = []
    // constructor
    constructor(userId) {
        this.userId = userId
        this.state = "following"
        this.menuList = []
    }
    // getter
    get userId() {
        return this.#userId
    }
    get state() {
        return this.#state
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
    async save(userId,state) {
        try {
            const sql = `INSERT INTO user(userId, state) VALUES ('${userId}', '${state}');`;
            const connection = await pool.getConnection((async conn=>conn));
            const saveresult = await connection.query(sql);
            connection.release();
            return saveresult

        }
        catch(err) { throw err }
    }
    async delete() {
        try {
            const sql = `DROP FROM user WHERE userId = '${this.userId}';`;
            const result = await Execute(sql)
            return result
        }
        catch (err) { throw err }
    }
    // static
    static async load(userId) {
        try {
            let sql = `SELECT * FROM user where userId = '${userId}';`;
            if(sql)
                console.log('sql create');
            let result = await Execute(sql)
            if(result)
                console.log('result create');
            //console.log(result[0]['userId']);
            let user = new User(result[0]['userId']);
            user.#state = result[0]['state']
            sql = `SELECT * FROM user_menulist where userId = '${userId}';`;
            result = await Execute(sql)
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

let user = User.load('userId')

export default User;
//module.exports.User = User