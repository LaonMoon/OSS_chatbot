const mysql = require('mysql2/promise')
const axios = require('axios')

pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Woals0313!',
    connectionLimit: 4,
    database: 'samplebot'
})

async function Execute(sql) {

    const conn =  await pool.getConnection()

    try {
        const [result] = await conn.query(sql)
        return result
    }
    catch (err) {
        throw err
    }
    finally {
        await conn.release()
    }
}

module.exports.Execute = Execute