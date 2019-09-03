const isInArray = require('./../../validator/isInArray');
const validate = require('./../validate');
const validatorFromValidate = require('./validatorFromValidate');

const isFidushalMarks = validatorFromValidate(validate({
    kind: isInArray(['graved', 'cut']),
    side: isInArray(['pcb', 'rackel', 'two-sided'])
}));

module.exports = isFidushalMarks;