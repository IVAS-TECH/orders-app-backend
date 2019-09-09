const encryptPassword = require('./encryptPassword');
const generateChecksum = require('./generateChecksum');

function generateUserDocument(data, checksumSecret) {
    return new Promise(async (resolve, reject) => {
        try {
            const { salt, hash } = await encryptPassword(data.password);
            const checksum = generateChecksum(data, checksumSecret);
            resolve({
                _id: data.userID,
                organizationID: data.organizationID,
                name: data.userName,
                email: data.email,
                passwordSalt: salt,
                passwordSHash: hash,
                phone: data.phone,
                role: data.role,
                checksum
            });
        } catch (err) {
            reject(errr);
        }
    });
}

module.exports = generateUserDocument;