const isLogin = require('../../validate/isLogin');
const comparePasswordWithHash = require('./utility/comparePasswordWithHash');
const handleInternalError = require('./../utility/handleInternalError');
const handleError = require('./../utility/handleError');

function login(req, res) {
    const data = req.body;
    const validationResult = isLogin(data);
    if(!validationResult.valid) {
        handleError(res, validationResult);
    } else {
        handleLogin(data, req.appShared.db, req.appShared.jwt.create, res);
    }
}

async function handleLogin(data, db, createJWT, res) {
    try {
        const userCollection = db.collection('user');
        const user = await userCollection.findOne({ email: data.email }, {
            projection: {
                _id: true,
                name: true,
                checksum: true,
                passwordSHash: true,
                role: true
            }
        });
        if(user) {
            handleUser(data, user, createJWT, res);
        } else {
            handleError(res, { failedTo: 'signIn' });
        }
    } catch(error) {
        handleInternalError({ data }, error, '[mongodb] Failed to check if user exists', res, 'checkUser');
    }
}

async function handleUser(data, user, createJWT, res) {
    try {
        const passwordMatch = await comparePasswordWithHash(data.password, user.passwordSHash);
        if(passwordMatch) {
            handleUserMatch(data, user, createJWT, res);
        } else {
            handleError(res, { failedTo: 'signIn' });
        }
    } catch(error) {
        handleInternalError({ data, user }, error, '[bcrypt] Failed to check if password matches', res, 'checkUser');
    }
}

async function handleUserMatch(data, user, createJWT, res) {
    try {
        const token = await createJWT({
            _id: user._id.toString(),
            name: user.name,
            email: data.email,
            checksum: user.checksum
        });
        res.status(200).json({ token, userName: user.name, userRole: user.role });
    } catch(error) {
        handleInternalError({ data, user }, error, '[jwt] Failed to generate JWT', res, 'generateJWT');
    }
}

module.exports = login;
