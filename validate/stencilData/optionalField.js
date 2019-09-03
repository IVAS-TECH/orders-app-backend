const isUndefined = require('./../../validator/isUndefined');

function optionalField(validator) {
    return val => isUndefined(val) || validator(val);
}

module.exports = optionalField; 