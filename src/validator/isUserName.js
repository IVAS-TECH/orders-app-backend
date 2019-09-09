const isString = require('./isString');

function validate(val) {
    return isString(val) && (val.length > 1) && (val.length < 24);
}

module.exports = validate;