const mysqlx = require('@mysql/xdevapi')

class MySQL {

    result
    #session

    constructor() {
        this.result = [1, 2, 3, 4]
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
        console.log(this.result)
        return this.result
    }
}

module.exports.MySQL = MySQL