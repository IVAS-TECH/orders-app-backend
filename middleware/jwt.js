const jsonwebtoken = require('jsonwebtoken');

function addJWT(secret) {
    const jwt = {
        create: data => createJWT(data, secret),
        verify: (data, token) => verifyJWT(data, token, secret)
    };

    return (req, _res, next) => {
        req.jwt = jwt;
        next();
    };
}

function createJWT(data, secret) {
    return new Promise((resolve, reject) => {
        jsonwebtoken.sign(JSON.stringify(data), secret, { algorithm: 'HS256' }, (err, token) => {
            if(err) {
                reject(err);
            } else {
                resolve(token);
            }
        });
    });
}

function verifyJWT(data, token, secret) {
    return new Promise((resolve, reject) => {
        jsonwebtoken.verify(token, secret, { algorithm: 'HS256' }, (err, decoded) => {
            if(err) {
                reject(err);
            } else {
                const keys = Object.keys(data);
                let result = true;
                for(const key of keys) {
                    if(decoded[key] !== data[key]) {
                        result = false;
                        break;
                    }
                }
                resolve(result);
            }
        });
    });
}

module.exports = addJWT;