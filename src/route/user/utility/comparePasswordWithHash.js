const bcrypt = require('bcrypt');

function comparePasswordWithHash(password, hash) {
    return bcrypt.compare(password, hash);
}

module.exports = comparePasswordWithHash;