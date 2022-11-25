const axios = require('axios');
const dataLoader = require('./dataLoader')

const url = "https://dorm2.khu.ac.kr/food/getWeeklyMenu.kmc?locgbn=K1&sch_date=&fo_gbn=stu"
let dd = dataLoader.load()
let d = axios.get(url)
.then((res) => {

    let raw = res.data['root'][0]['WEEKLYMENU'][0]
    let data = {}
    let keys = []

    for (let key in raw)
        if (raw.hasOwnProperty(key)) keys.push(key)
    keys.sort()
    for (let idx = 0; idx < keys.length; idx++)
        data[keys[idx]] = raw[keys[idx]]
    return data
})
console.log(dd)