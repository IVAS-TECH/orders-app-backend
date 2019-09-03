const isCount = require('../../validator/isCount');
const isNatural = require('./../../validator/isNatural');
const validate = require('./../validate');

const isMultiplyOnAxis = validate({
    count: isCount,
    step: isNatural
});

module.exports = isMultiplyOnAxis;