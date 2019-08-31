const mongodb = require('mongodb');
const isOrganizationManager = require('../../validate/isOrganizationManager');
const generateUserDocument = require('./utility/generateUserDocument');
const handleInternalError = require('./../utility/handleInternalError');
const handleError = require('./../utility/handleError');

function createOrganizationManager(req, res) {
    const data = req.body;
    const validationResult = isOrganizationManager(data);
    if(!validationResult.valid) {
        handleError(res, validationResult);
    } else {
        handleOrganizationManager(data, req.appShared.db, req.appShared.checksumSecret, res);
    }
}

async function handleOrganizationManager(data, db, checksumSecret, res) {
    try {
        const organizationCollection = db.collection('organization');
        const organization = await organizationCollection.findOne({ name: data.organization });
        if(organization) {
            handleError(res, { organizationExists: data.organization });
        } else {
            try {
                const userCollection = db.collection('user');
                const user = await userCollection.findOne({ email: data.email });
                if(user) {
                    handleError(res, { userWithThisEmailExists: data.email });
                } else {
                    createOrganizationAndUser(data, db, checksumSecret, res);
                }
            } catch(error) {
                handleInternalError({ data }, error, '[mongodb] Failed to check if user exists', res, 'checkUser');
            }
        }
    } catch(error) {
        handleInternalError({ data }, error, '[mongodb] Failed to check if organization exists', res, 'checkOrganization');
    }
}

async function createOrganizationAndUser(data, db, checksumSecret, res) {
    const userID = new mongodb.ObjectID();
    const organizationID = new mongodb.ObjectID();
    const organizationCollection = db.collection('organization');
    const organizationDocument = {
        _id: organizationID,
        managerID: userID,
        name: data.organization
    };
    try {
        const _organization = await organizationCollection.insertOne(organizationDocument);
        handleUserCreation({ userID, organizationID, data }, db, checksumSecret, res);
    } catch(error) {
        handleInternalError({ organizationDocument, data }, error, '[mongodb] Failed to create organization', res, 'createOrganization');
    }
}

async function handleUserCreation({
    userID,
    organizationID,
    data
}, db, checksumSecret, res) {
    const documentData = {
        userID,
        organizationID,
        userName: data.userName,
        email: data.email,
        password: data.password,
        phone: data.phone,
        role: 'organizationManager'
    };
    try {
        const userDocument = await generateUserDocument(documentData, checksumSecret);
        try {
            const userCollection = db.collection('user');
            const _inserted = await userCollection.insertOne(userDocument);
            res.status(200).json({ result: 'createdOrganizationManager' });
        } catch(error) {
            handleUserCreationError({ documentData, error, logMessage: '[mongodb] Failed to create user' }, res);
        }
    } catch(error) {
        handleUserCreationError({ documentData, error, logMessage: '[bcrypt] Failed to salt/hash password' }, res);
    }
}

async function handleUserCreationError({
    documentData,
    error,
    logMessage
}, res) {
    handleInternalError({ documentData }, error, logMessage, res, 'createUser');
    try {
        const organizationCollection = db.collection('organization');
        const _result = await organizationCollection.deleteOne({ _id: organizationID});
    } catch(error) {
        handleInternalError({ organizationID }, error, '[mongodb] Failed to delete organization');
    }
}

module.exports = createOrganizationManager;
