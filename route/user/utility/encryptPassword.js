const bcrypt = require('bcrypt');

const saltRounds = 12;

function encryptPassword(password) {
    return new Promise(async (resolve, reject) => {
        try {
            const salt = await bcrypt.genSalt(saltRounds);
            try {
                const hash = await bcrypt.hash(password, salt);
                resolve({ salt, hash });
            } catch(err) {
                reject(err);
            }
        } catch(err) {
            reject(err);
        }
    });
}

module.exports = encryptPassword;