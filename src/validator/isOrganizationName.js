const isString = require('./isString');

function validate(val) {
    return isString(val) && (val.length > 2) && (val.length < 100);
}

module.exports = validate;