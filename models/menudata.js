const db = require('../methods/database')
const axios = require('axios')

class MenuData {
    //private
    #data

    //constructor
    constructor(data) {
        this.#data = data
    }

    //getter
    get data() {
        return this.#data
    }

    //setter
    set data(data) {
        this.#data = data
    }

    //methods
    async save() {

        let rows = Object.values(this.#data)
        let sql_keys = ''
        let sql_values = ''
        for(let row of rows) {
            let sql_keys = ''
            let sql_values = ''
            let keys = Object.keys(row)
            for(let key of keys) {
                sql_keys += (key + ', ')
                sql_values += ("'" + row[key]  + "'" + ', ')
            }
            try {
                await db.Execute(`INSERT INTO menudata (${sql_keys.slice(0, sql_keys.length-2)})
                        VALUES (${sql_values.slice(0, sql_values.length-2)})`)
            }
            catch (err) {
                throw err
            }
        }
    }

    //static
    static async load(date) {

        let sql = `SELECT * FROM menudata WHERE date = '${date}'`
        let result = await db.Execute(sql)
        let menudata = new MenuData(result)
        return menudata
    }
    static async GetMenuData() {

        const url = "https://dorm2.khu.ac.kr/food/getWeeklyMenu.kmc?locgbn=K1&sch_date=&fo_gbn=stu"
        let data = []

        await axios.get(url)
        .then(async function (res) {
            data = await res.data['root'][0]['WEEKLYMENU'][0]
        })
        return data
    }
    static async ProcessData(raw) {
    
        let data = []
    
        for (let day = 1; day <= 5; day++) {
            let row = {
                date: raw['fo_date' + day],
                lunch_A: raw['fo_menu_lun' + day],
                lunch_B: raw['fo_sub_lun' + day],
                dinner: raw['fo_menu_eve' + day]
            }
            data.push(row)
        }
        return data
    }  
}

module.exports.MenuData = MenuData