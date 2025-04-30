const fs = require('fs');
const path = require('path');

 const convertCSVtoJson = async (fileName) => {
    const data = fs.readFileSync(path.join(__dirname, fileName), 'utf8');
    let dataStr = data.split('\n');
    let dataToStr = dataStr.map((elem) => {
        const elemArr = elem.split(',');
        const key = elemArr[0];
        const obj = {};
        obj[key] = elemArr[elemArr.length - 1].trim('\r');
        return obj;
    });

    const finalObj = {};
    dataToStr.forEach((elem) => {
        finalObj[Object.keys(elem)[0]] = elem[Object.keys(elem)[0]];
    })
    fs.writeFileSync(path.join(__dirname, 'pinToStd.json'), `${JSON.stringify(finalObj)}`, 'utf8');
    return;
};

module.exports = convertCSVtoJson;