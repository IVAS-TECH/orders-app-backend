const isBase64URL = require('./isBase64URL');

function validate(val) {
    return isBase64URL(val) && (val.length < 255);
}

module.exports = validate;