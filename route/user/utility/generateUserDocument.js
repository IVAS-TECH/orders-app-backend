const encryptPassword = require('./encryptPassword');

function generateUserDocument({
    userID,
    organizationID,
    userName,
    email,
    password,
    phone
}) {
    return new Promise(async (resolve, reject) => {
        try {
            const { salt, hash } = await encryptPassword(password);
            resolve({
                _id: userID,
                organizationID,
                name: userName,
                email,
                passwordSalt: salt,
                passwordSHash: hash,
                phone
            });
        } catch (err) {
            reject(errr);
        }
    });
}

module.exports = generateUserDocument;