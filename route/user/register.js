const mongodb = require('mongodb');
const base64URL = require('base64url');
const isRegister = require('../../validate/isRegister');
const isJWT= require('../../validator/isJWT');
const isObjectId = require('../../validator/isObjectId');
const isOrganizationInfo = require('../../validator/isOrganizationInfo');
const generateUserDocument = require('./utility/generateUserDocument');
const handleInternalError = require('./../utility/handleInternalError');
const handleError = require('./../utility/handleError');

async function register(req, res) {
    const data = req.body;
    const { organization } = req.params;
    const validationResult = isRegister(data);
    if(!validationResult.valid) {
        handleError(res, validationResult);
        return;
    }
    if(!isOrganizationInfo(organization)) {
        handleError(res, { invalidOrganizationInfo: true });
        return;
    }
    const jwtToken = base64URL.decode(organization);
    if(!isJWT(jwtToken)) {
        handleError(res, { invalidJWT: true });
        return;
    }
    try {
        const { id } = await req.appShared.jwt.decode(jwtToken);
        if(!isObjectId(id)) {
            handleError(res, { decodedTokenDoesNotIncludeValidId: true });
            return;
        }
        const organizationID = new mongodb.ObjectID(id);
        handleRegister(data, req.appShared.db, organizationID, req.appShared.checksumSecret, res);
    } catch(error) {
        handleError(res, { invalidJWT: true });
    }
}

async function handleRegister(data, db, organizationID, checksumSecret, res) {
    try {
        const organizationCollection = db.collection('organization');
        const organization = await organizationCollection.findOne({ _id: organizationID }, { projction: { _id: true } });
        if(organization) {
            handleRegisterUser(data, organizationID, db, checksumSecret, res);
        } else {
            handleError(res, { organizationDoesNotExist: true });
        }
    } catch(error) {
        handleInternalError({ organizationID }, error, '[mongodb] Failed to check if organization exists', res, 'checkOrganization');
    }
}

async function handleRegisterUser(data, organizationID, db, checksumSecret, res) {
    try {
        const userCollection = db.collection('user');
        const query = { $or: [ { name: data.userName, organizationID }, { email: data.email } ] };
        const user = await userCollection.findOne(query, { projction: { name: true, email: true } });
        if(user) {
            if(user.email === data.email) {
                handleError(res, { userWithThisEmailExists: data.email });
            } else {
                handleError(res, { userWithThisUserNameExistsInTheOrganization: data.userName });
            }
        } else {
            registerUser(data, organizationID, db, checksumSecret, res);
        }
    } catch(error) {
        handleInternalError({ data, organizationID }, error, '[mongodb] Failed to check if user exists', res, 'checkUser');
    }
}

async function registerUser(data, organizationID, db, checksumSecret, res) {
    const userID = new mongodb.ObjectID();
    const documentData = {
        userID,
        organizationID,
        userName: data.userName,
        email: data.email,
        password: data.password,
        phone: data.phone,
        role: 'user'
    };
    try {
        const userDocument = await generateUserDocument(documentData, checksumSecret);
        try {
            const userCollection = db.collection('user');
            const _inserted = await userCollection.insertOne(userDocument);
            res.status(200).json({ result: 'registeredUser' });
        } catch(error) {
            handleInternalError({ userDocument }, error, '[mongodb] Failed to create user', res, 'createUser');
        }
    } catch(error) {
        handleInternalError({ userDocument }, error, '[bcrypt] Failed to salt/hash password', res, 'createUserDocument');
    }
}

module.exports = register;