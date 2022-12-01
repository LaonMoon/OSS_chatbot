const mysql = require('mysql2/promise')
const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Woals0313!',
    connectionLimit: 4,
    database: 'samplebot'
})

const sql = 'SELECT * FROM user'
const result = async () => {
    const conn = connection.getConnection()

    try {
        const [row] = await conn.query("SELECT * FROM user")
        return row
    }
    catch(err) {
        throw new Error(err)
    }
    finally {
        conn.release()
    }
}

console.log(result)

module.exports.MySQL = MySQL