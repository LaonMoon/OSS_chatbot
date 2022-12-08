import pool from "../config/database"
// Return result object of sql
async function Execute(sql) {
    const conn =  await pool.getConnection()

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