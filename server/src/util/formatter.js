function addDays(date, intervalDays) {
    return new Date(date.setDate(date.getDate() + intervalDays));
}

exports.getTomorrow = () => {
    const tomorrow = addDays(new Date(), 1);
    return tomorrow;    
}

exports.adjustDate = (d, i) => {
    return addDays(d, i);
}

exports.toStandardDateFormat = (dt) => {
    const year = dt.getFullYear();
    const _month = dt.getMonth() + 1;
    const month = _month < 10 ? '0' + _month : _month;
    const _date = dt.getDate();
    const date = _date < 10 ? '0' + _date : _date;
    return `${year}-${month}-${date}`;
}

exports.toDateObject = (dt) => {
    try{
        const [year, wrongMonth, dateTemp] = dt.split('-');
        const [date, _] = dateTemp.split('T');
        return new Date(year, wrongMonth-1, date);
    } catch(error) {
        console.log(error);
        return new Date();
    }
}