function validatorFromValidate(validate) {
    if((typeof validate) !== 'function') {
        throw new TypeError('validator is not a function');
    }
    return val => validate(val).valid === val; 
}

module.exports = validatorFromValidate;