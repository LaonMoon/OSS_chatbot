const axios = require('axios');

function GetMenuData() {
    const url = "https://dorm2.khu.ac.kr/food/getWeeklyMenu.kmc?locgbn=K1&sch_date=&fo_gbn=stu"
    axios.get(url)
    .then(function (res) {
        let data = res.data['root'][0]['WEEKLYMENU'][0];
        console.log(data)
        /*
            handle data with database here
        */
    })
}

module.exports.GetMenuData = GetMenuData