const crypto = require('crypto');

function generateChecksum({
    userID,
    organizationID,
    userName,
    email,
    password,
    phone
}, checksumSecret) {
    const hash = crypto.createHash('sha256');
    hash.update(userID.toString());
    hash.update(organizationID.toString());
    hash.update(userName);
    hash.update(email);
    hash.update(password);
    hash.update(phone);
    hash.update(checksumSecret);
    return hash.digest('hex');
}

module.exports = generateChecksum;