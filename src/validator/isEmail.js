const isEmail = require('validator/lib/isEmail');
const isString = require('./isString');

function validate(val) {
    return isString(val) && (val.length < 255) && isEmail(val);
}

module.exports = validate;