const isString = require('./isString');

const regEx = /[0-9A-Za-z_-]*/;

function isPassword(val) {
    return isString(val) && (val.length > 7) && (val.length < 33) && regEx.test(val) && checkConditions(val);
}

function checkConditions(str) {
    let digit = false;
    let lowerCase = false;
    let upperCase = false;
    for(let i = 0; i < str.length; ++i) {
        if(/[0-9]/.test(str[i])) {
            digit = true;
            continue;
        }
        if(/[a-z]/.test(str[i])) {
            lowerCase = true;
            continue;
        }
        if(/[A-Z]/.test(str[i])) {
            upperCase = true;
        }
    }
    return digit && lowerCase && upperCase;
}

module.exports = isPassword;