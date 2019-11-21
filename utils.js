const moment = require('moment')

function getPreviousMonth(month) {
    return month === 0 ? 11 : month - 1
}


function getDatesInMonth(month) {
    let dateArray = []
    let currDate = moment(month)
    let endOfMonth = moment(month).add(1, 'month')
    while (currDate < endOfMonth) {
        dateArray.push(moment(currDate).format("L"));
        currDate = currDate.add(1, 'day')
    }

    return dateArray
}

function getDaysPerWeekFromMonth(monthDays) {
    let chunk = 7 //initialMOnthLoops(monthDays[0]) +1
    let temp = []
    let i,j = 0
    if(moment(monthDays[0]).get('day') == 0){
        temp.push( monthDays.slice(i, 1))
        j  = 1
    }else if(moment(monthDays[0]).get('day')!== 1){
        let loops = 7 - moment(monthDays[0]).get('day')
        temp.push( monthDays.slice(i, loops+1))
        j = loops +1
    }
    for ( i = j; i< monthDays.length; i += chunk) {
        temp.push( monthDays.slice(i, i + chunk))
    }
    return temp
}

module.exports = {
    getDates(from, to) {
        let months = []
        let current = moment(from)

        let end = moment(to)
        while (current <= end) {
            months.push({month:moment(current).format('MMMM YYYY'), weeks: getDaysPerWeekFromMonth(getDatesInMonth(current))})
            current = current.add(1, 'month')
        }
        return months
    }
}


