require("dotenv").config();
import mysql from "mysql2/promise"
const pool = mysql.createPool({
    host: 'localhost',
    user:'root',
    port: '3306',
    password: '58859476',
    database: 'osschatbotdb'
});

export default pool;