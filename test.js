/* const User = require("./model/user").User

let user = User.Load('U3c5199b84bae262c48381504168fe4b2')
console.log("userId : " + user.get_userId())
console.log("state : " + user.get_state())
console.log("menuList : " + user.get_menuList()) */


/* const MySQL = require("./methods/database").MySQL

const mysql = new MySQL()
results = mysql.Execute("SELECT * FROM user")
console.log(results) */

/* const mysqlx = require('@mysql/xdevapi')

db = mysqlx.getSession({
    user: 'root',
    password: 'Woals0313!',
    host: 'localhost',
    port: 33060,
})
.then(function (mySession) {
    // Get a list of all available schemas
    return mySession.getSchema('samplebot');
})
.then(function (schema) {
    return schema
});

console.log(db.getSchema('samplebot')) */

const mysql = require('mysql2/promise')

connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Woals0313!',
    connectionLimit: 4,
    database: 'samplebot'
})
const sql = 'SELECT * FROM user'
async function getUser() {
    const conn =  await connection.getConnection()
    const [result] = await conn.query("SELECT * FROM user")
    await conn.release()
    return result
}
let result = getUser()
console.log(result)