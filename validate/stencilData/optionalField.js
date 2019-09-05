const isUndefined = require('./../../validator/isUndefined');

function optionalField(validator) {
    if((typeof validator) !== 'function') {
        throw new TypeError('validator is not a function');
    }
    return val => isUndefined(val) || validator(val);
}

module.exports = optionalField; 