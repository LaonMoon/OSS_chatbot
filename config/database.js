const dotenv = require('dotenv')
dotenv.config()
const mysql = require('mysql2/promise')

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    connectionLimit: 4,
    database: process.env.DB_DATABASE
})

module.exports.pool = pool