const isNatural = require('./isNatural');

function isCount(val) {
    return isNatural(val) && val !== 0;
}

module.exports = isCount;