const isEmail = require('../validator/isEmail');
const isMobilePhone = require('../validator/isMobilePhone');
const isPassword = require('./../validator/isPassword');
const isUserName = require('../validator/isUserName');
const validate = require('./validate');

const isRegister = validate({
    email: isEmail,
    password: isPassword,
    confirmPassword: (val, { password }) => val === password,
    userName: isUserName,
    phone: isMobilePhone
});

module.exports = isRegister;