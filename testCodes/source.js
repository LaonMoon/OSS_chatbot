const axios = require('axios');
const url = "https://dorm2.khu.ac.kr/food/getWeeklyMenu.kmc?locgbn=K1&sch_date=&fo_gbn=stu"
axios.get(url)
.then(function (response) {
    let data = response.data['root'][0]['WEEKLYMENU'][0];
    let types = {
        A: "menu_",
        B: "sub_",
    };
    let times = {
        lunch: "lun",
        evening: "eve",
    }
    let days = {
        monday: '1',
        tuesday: '2',
        wednesday: '3',
        thursday: '4',
        friday: '5',
        saturday: '6',
        sunday: '7',
    };
    console.log(data)
    for (let day in days) {
        for (let time in times) {
            for (let type in types) {
                if ((days[day] == '6' || days[day] == '7')) {
                    console.log(day + " " + time + " " + type + " - no food provided in weekend.");
                    continue;
                }
                if (times[time] == "eve" && types[type] == "sub_") {
                    console.log(day + " " + time + " " + type + " - only A provided in the evening");
                    continue;
                }
                if (days[day] == '5' && times[time] == "eve") {
                    console.log(day + " " + time + " " + type + " - no food provided on friday in the evening");
                    continue;
                }
                let query = "fo_" + types[type] + times[time] + days[day];
                console.log(day + " " + time + " " + type + " is " + data[query]);
            }
        }
    }
})