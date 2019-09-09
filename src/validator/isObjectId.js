const isMonoId = require('validator/lib/isMongoId');
const isString = require('./isString');

function validate(val) {
    return isString(val) && isMonoId(val);
}

module.exports = validate;