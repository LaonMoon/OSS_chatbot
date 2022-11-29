const axios = require('axios')
const db = require('./database')

async function GetMenuData() {

    const url = "https://dorm2.khu.ac.kr/food/getWeeklyMenu.kmc?locgbn=K1&sch_date=&fo_gbn=stu"
    let data = {}

    await axios.get(url)
    .then(async function (res) {
        data = await res.data['root'][0]['WEEKLYMENU'][0]
    })
    return data
}

async function ProcessData(raw) {

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

async function SaveData(data) {

    let rows = Object.values(data)
    let sql_keys = ''
    let sql_values = ''
    for(let row of rows) {
        sql_keys = ''
        sql_values = ''
        keys = Object.keys(row)
        for(let key of keys) {
            sql_keys += (key + ', ')
            sql_values += ("'" + row[key]  + "'" + ', ')
        }
        try {
            db.Execute(`INSERT INTO menudata (${sql_keys.slice(0, sql_keys.length-2)})
                    VALUES (${sql_values.slice(0, sql_values.length-2)})`)
        }
        catch (err) {
            throw err
        }
    }
}

module.exports.GetMenuData = GetMenuData
module.exports.ProcessData = ProcessData
module.exports.SaveData = SaveData