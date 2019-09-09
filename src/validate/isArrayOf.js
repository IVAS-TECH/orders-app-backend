const isArray = require('./../validator/isArray');

function isArrayOf(validator, length) {
    return val => isArray(val) && (val.length <= length) && val.every(validator);
}

module.exports = isArrayOf;