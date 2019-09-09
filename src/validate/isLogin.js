const isEmail = require('../validator/isEmail');
const isPassword = require('./../validator/isPassword');
const validate = require('./validate');

const isLogin = validate({
    email: isEmail,
    password: isPassword
});

module.exports = isLogin;