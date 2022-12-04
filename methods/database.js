const mysql = require('mysql2/promise')

connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Woals0313!',
    connectionLimit: 4,
    database: 'chatbot'
})

// Return result object of sql
async function Execute(sql) {
    const conn =  await connection.getConnection()

    try {
        const [result] = await conn.query(sql)
        return result
    }
    catch (err) {
        throw new Error(err)
    }
    finally {
        conn.release()
    }
}

module.exports.Execute = Execute