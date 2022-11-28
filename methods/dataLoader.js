const axios = require('axios');

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
            dinner: raw['fo_main_eve' + day]
        }
        data.push(row)
    }
    return data
}

module.exports.GetMenuData = GetMenuData
module.exports.ProcessData = ProcessData