const isISO8601 = require('validator/lib/isISO8601');
const isString = require('./isString');

const options = { strict: true };

function validate(val) {
    return isString(val) && isISO8601(val, options);
}

module.exports = validate;