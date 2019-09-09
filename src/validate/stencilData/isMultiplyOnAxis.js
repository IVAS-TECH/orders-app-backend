const isCount = require('../../validator/isCount');
const isNatural = require('./../../validator/isNatural');
const validate = require('./../validate');

const isMultiplyOnAxis = validate({
    panelsCount: isCount,
    step: isNatural
});

module.exports = isMultiplyOnAxis;