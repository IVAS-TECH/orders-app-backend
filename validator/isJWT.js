const isJWT = require('validator/lib/isJWT');
const isString = require('./isString');

function validate(val) {
    return isString(val) && isJWT(val);
}

module.exports = validate;