const validateIsMultiplyOnAxis = require('./isMultiplyOnAxis');
const validatorFromValidate = require('./validatorFromValidate');
const validate = require('./../validate');

const isMultiplyOnAxis = validatorFromValidate(validateIsMultiplyOnAxis);

const isMultply = validatorFromValidate(validate({
    x: isMultiplyOnAxis,
    y: isMultiplyOnAxis
}));

module.exports = isMultply;