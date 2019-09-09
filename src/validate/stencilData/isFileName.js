const isString = require('./../../validator/isString');

function isFileName(val) {
    return isString(val) && val.length > 4 && val.length < 250; 
}

module.exports = isFileName;