const isString = require('./isString');

const regEx = /[0-9A-Za-z_-]*/;

function validate(val) {
    return isString(val) && regEx.test(val);
}

module.exports = validate;