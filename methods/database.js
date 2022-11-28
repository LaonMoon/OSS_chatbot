/* const mysqlx = require('@mysql/xdevapi')

class MySQL {

    result
    #session

    constructor() {
        this.result = []
    }

    async Execute(sql) {
        mysqlx.getSession({
            user: 'root',
            password: 'Woals0313!',
            host: 'localhost',
            port: 33060,
        })
        .then(_session => {
            this.#session = _session
            return this.#session.getSchema('samplebot')
        })
        .then(() => {
            return Promise.all([
                this.#session.sql('USE samplebot').execute()
            ])
        })
        .then(() => {
            return this.#session.sql(sql).execute()
        })
        .then(_result => {
            this.result = _result.fetchAll()
        })
        .then(() => {
            this.#session.close()
        })
        .catch(err => {
            throw err
        })
        return this.result
    }
}

module.exports.MySQL = MySQL */

const mysql = require('mysql2/promise')

connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Woals0313!',
    connectionLimit: 4,
    database: 'samplebot'
})

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