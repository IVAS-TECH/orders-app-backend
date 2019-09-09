const mongodb = require('mongodb');
const isJWT = require('../validator/isJWT');
const isString = require('../validator/isString');
const handleError = require('../route/utility/handleError');

const tokenRegEx = /Bearer (.+)/;

async function authUser(req, res, next) {
    const authHeader = req.headers['authorization'];
    if(!authHeader) {
        handleError(res, { accessDenied: true });
        return;
    }
    if(!isString(authHeader)) {
        handleError(res, { accessDenied: true });
        return;
    }
    if(authHeader.length > 2000) {
        handleError(res, { accessDenied: true });
        return;
    }
    const result = tokenRegEx.exec(authHeader);
    if(!result) {
        handleError(res, { accessDenied: true });
        return;
    }
    const token = result[1];
    if(!isJWT(token)) {
        handleError(res, { accessDenied: true });
        return;
    }
    try {
        const { _id, checksum } = await req.appShared.jwt.decode(token);
        try {
            const userCollection = req.appShared.db.collection('user');
            const userID = new mongodb.ObjectID(_id);
            const user = await userCollection.findOne({ _id: userID });
            if(!user) {
                handleError(res, { accessDenied: true });
                return;
            }
            if(user.checksum !== checksum) {
                handleError(res, { accessDenied: true });
                return;
            }
            req.user = user;
            next();
        } catch(error) {
            handleInternalError({ token, _id, checksum }, error, '[mongodb] Failed to check if user exists', res, 'checkUser');
        }
    } catch(error) {
        handleError(res, { accessDenied: true });
    }
}

module.exports = authUser;