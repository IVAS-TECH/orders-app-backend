const isOrganizatioName = require('../validator/isOrganizationName');
const isEmail = require('../validator/isEmail');
const isMobilePhone = require('../validator/isMobilePhone');
const isPassword = require('./../validator/isPassword');
const isUserName = require('../validator/isUserName');
const validate = require('./validate');

const isOrganizatioManager = validate({
    userName: isUserName,
    password: isPassword,
    confirmPassword: (val, { password }) => val === password,
    email: isEmail,
    phone: isMobilePhone,
    organization: isOrganizatioName
});

module.exports = isOrganizatioManager;