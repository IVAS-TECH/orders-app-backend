const isFileName = require('./isFileName');
const isBoolean = require('./../../validator/isBoolean');
const isString = require('./../../validator/isString');
const isCount = require('./../../validator/isCount');
const isInArray = require('./../../validator/isInArray');
const isFidushalMarks = require('./isFidushalMarks');
const isText = require('./isText');
const isMultiply = require('./isMultply');
const optionalField = require('./optionalField');
const validate = require('./../validate');

const isStencilData = validate({
    fileName: isFileName,
    fileIsFromRackelSide: isBoolean,
    count: isCount,
    sheetThickness: isInArray([30, 40, 50, 80, 90, 100, 110, 120, 130, 150, 180, 200, 250, 300]),
    fidushalMarks: optionalField(isFidushalMarks),
    modificationsRequirements: optionalField(val => isString(val) && val.length < 2000),
    text: optionalField(isText),
    multiply: optionalField(isMultiply),
    position: isInArray(['pcb-centered', 'layout-centered']),
    imagePosition: isInArray(['horizontal', 'vertical']),
    nanoCoating: isBoolean,
    electrochemicalPolishing: isBoolean
});

module.exports = isStencilData;