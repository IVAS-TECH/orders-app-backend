function validate(validatorMap) {
    const shape = Object.keys(validatorMap);
    return data => {
        if(typeof data !== 'object') {
            return { invalidData: 'notAnObject' };
        }
        const keys = Object.keys(data);
        for(const key of keys) {
            if(!shape.includes(key)) {
                return { invalidKey: key };
            }
        }
        for(const key of shape) {
            if(!validatorMap[key](data[key], data)) {
                return { invalidField: key };
            }
        }
        return { valid: data };
    };
}

module.exports = validate;