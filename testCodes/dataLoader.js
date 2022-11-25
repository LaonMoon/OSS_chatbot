const axios = require ("axios")

class DataLoader {
    //private
    #data
    //public

    GetData() {
        const url = "https://dorm2.khu.ac.kr/food/getWeeklyMenu.kmc?locgbn=K1&sch_date=&fo_gbn=stu"
        axios.get(url)
        .then(res => {
            this.#data = res.data['root'][0]['WEEKLYMENU'][0]
        })
    }
    ProcessData() {
        let temp = this.#data
        
    }
}

    /* let raw = response.data['root'][0]['WEEKLYMENU'][0];
    let data = {};
    let keys = [];

    for (let key in raw)
        if (raw.hasOwnProperty(key)) keys.push(key);
    keys.sort()
    for (let idx = 0; idx < keys.length; idx++)
        data[keys[idx]] = raw[keys[idx]];
    
    console.log(response);
    return data; */

module.exports.load = load;