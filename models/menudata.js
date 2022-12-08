const db = require('../methods/database')
const axios = require('axios')

class MenuData {
    /*
        - MenuData is a class for handling menu data with database.
        - Attributes: date(pk), lunch_A, lunch_B, dinner
        - Considering the convenience of managing data with multiple rows,
          the class has on object named data and it is expected to be formed like this
          [{date: String, lunch_A: String, lunch_B: String, dinner: String}, {}, {}, ...]
    */

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
        /*
            save the data of this object to database
        */

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
    static async load(dates) {
        /*
            Input: dates (An array consisted of one or more date(date is pk of menudata))
            Return: A class object (The object has data loaded from database by dates)
        */

        try {
            let sql = `SELECT * FROM menudata WHERE `
            for(let idx in dates) {
                const date = dates[idx]
                if(idx == 0) {
                    sql += `date='${date}'`
                }
                else {
                    sql  += ` OR date='${date}'`
                }
            }
            let result = await db.Execute(sql)
            let menudata = new MenuData(result)
            return menudata
        }
        catch(err) {
            throw err
        }
    }
    static async GetMenuData() {
        /*
            Get menu data from the url below with axios module.
        */

        const url = "https://dorm2.khu.ac.kr/food/getWeeklyMenu.kmc?locgbn=K1&sch_date=&fo_gbn=stu"
        let data = []
        await axios.get(url)
        .then(async function (res) {
            data = await res.data['root'][0]['WEEKLYMENU'][0]
        })
        return data
    }
    static async ProcessData(raw) {
        /*
            Process the raw data got from GetMenuData to the right form for database
            {date: String, lunch_A: String, lunch_B: String, dinner: String}
        */
    
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