const isNumber = require('./isNumber');

function isNatural(val) {
    return isNumber(val) && Number.isInteger(val) && val >= 0;
}

module.exports = isNatural;