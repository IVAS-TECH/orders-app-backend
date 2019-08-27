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
        handleOrganizationManager(data, req.db, res);
    }
}

async function handleOrganizationManager(data, db, res) {
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
                    handleError(res, { userExists: data.email });
                } else {
                    createOrganizationAndUser(data, db, res);
                }
            } catch(error) {
                handleInternalError(
                    { data },
                    error,
                    '[mongodb] Failed to check if user exists',
                    res, { reason: 'checkUser' }
                );
            }
        }
    } catch(error) {
        handleInternalError(
            { data },
            error,
            '[mongodb] Failed to check if organization exists',
            res, { reason: 'checkOrganization' }
        );
    }
}

async function createOrganizationAndUser(data, db, res) {
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
        handleUserCreation({
            userID,
            organizationID,
            data
        }, db, res);
    } catch(error) {
        handleInternalError(
            { organizationDocument, data },
            error,
            '[mongodb] Failed to create organization',
            res, { reason: 'createOrganization' }
        );
    }
}

async function handleUserCreation({
    userID,
    organizationID,
    data
}, db, res) {
    const documentData = {
        userID,
        organizationID,
        userName: data.userName,
        email: data.email,
        password: data.password,
        phone: data.phone
    };
    try {
        const userDocument = await generateUserDocument(documentData);
        try {
            const userCollection = db.collection('user');
            const _inserted = await userCollection.insertOne(userDocument);
            res.status(200).json({ result: 'createdOrganizationManager' });
        } catch(error) {
            handleUserCreationError({
                documentData,
                error,
                logMessage: '[mongodb] Failed to create user'
            }, res);
        }
    } catch(error) {
        handleUserCreationError({
            documentData,
            error,
            logMessage: '[bcrypt] Failed to salt/hash password'
        }, res);
    }
}

async function handleUserCreationError({
    documentData,
    error,
    logMessage
}, res) {
    handleInternalError({ documentData }, error, logMessage, res, { reason: 'createUser' });

    try {
        const organizationCollection = db.collection('organization');
        const _result = await organizationCollection.deleteOne({ _id: organizationID});
    } catch(error) {
        handleInternalError({ organizationID }, error, '[mongodb] Failed to delete organization');
    }
}

module.exports = createOrganizationManager;