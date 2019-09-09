const isMobilePhone = require('validator/lib/isMobilePhone');
const isString = require('./isString');

function validate(val) {
    return isString(val) && (val.length < 20) && isMobilePhone.default(val);
}

module.exports = validate;