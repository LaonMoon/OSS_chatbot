const dotenv = require('dotenv')
dotenv.config()

const mysql = require('mysql2/promise')

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Abc7878!',
    connectionLimit: 4,
    database: 'osschatbotdb'
})

export default pool