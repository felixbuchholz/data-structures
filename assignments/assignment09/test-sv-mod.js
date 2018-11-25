var moment = require('moment-timezone');
const sv = '1543027536 1903 2363 1743 2243 2313 2707,1543027476 1903 2363 1743 2243 2313 2707,1543027416 1903 2363 1743 2243 2313 2707,1543027356 1903 2363 1743 2243 2313 2707,1543027296 1903 2363 1743 2243 2313 2707,1543027236 1903 2363 1743 2243 2313 2707,1543027176 1903 2363 1743 2243 2313 2707,1543027116 1903 2363 1743 2243 2313 2707,1543027056 1903 2363 1743 2243 2313 2707,1543026996 1903 2363 1743 2243 2313 2655,1543026936 1903 2363 1743 2243 2313 2655,1543026876 1903 2363 1743 2243 2313 2655,1543026816 1903 2363 1743 2243 2313 2655,1543026756 1903 2363 1743 2243 2313 2655,1543026696 1903 2363 1743 2243 2313 2655';
const minArr = sv.split(',');
console.log(minArr);
let minObjArr = [];
minArr.forEach((min, i) => {
    let minObj = {};
    const timeAndValues = min.split(' ');
    let date = new Date(timeAndValues[0]*1000);
    date = moment.tz(date, "America/New_York").format();
    const dateAndTime = date.split('T');
    const dateArr = dateAndTime[0].split('-'); // 2018-11-23
    const timeArr = dateAndTime[1].split('-')[0].split(':'); // 22:13:04
    minObj['date']  = date;
    minObj['year']  = dateArr[0];
    minObj['month'] = dateArr[1];
    minObj['day']   = dateArr[2];
    minObj['hour']  = timeArr[0];
    minObj['min']   = timeArr[1];
    minObj['xmin']  = timeAndValues[1];
    minObj['xmax']  = timeAndValues[2];
    minObj['ymin']  = timeAndValues[3];
    minObj['ymax']  = timeAndValues[4];
    minObj['zmin']  = timeAndValues[5];
    minObj['zmax']  = timeAndValues[6];
    minObjArr.push(minObj);
});
console.log(minObjArr)

