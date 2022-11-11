const request = require('request');

const options = {
    uri : "https://dorm2.khu.ac.kr/food/getWeeklyMenu.kmc",
    qs : {
        locgbn: "K1",
        sch_date: "",
        fo_gbn: "stu"
    }
};
request.get(options, function (error, response, body) {
    //callback
    console.log(body)
});