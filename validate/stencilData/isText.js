const isString = require('./../../validator/isString');

function isText(val) {
    if((typeof val) !== 'object') {
        return false;
    }
    const keysCount = Object.keys(val).length;
    if((keysCount === 0) || (keysCount > 2)) {
        return false;
    }
    const rackelSide = isTextField(val.rackelSide);
    const pcbSide = isTextField(val.pcbSide);
    return rackelSide || pcbSide;
}

function isTextField(val) {
    return isString(val) && val.length < 256;
}

module.exports = isText;