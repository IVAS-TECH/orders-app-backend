function validatorFromValidate(validate) {
    return val => validate(val).valid === val; 
}

module.exports = validatorFromValidate;