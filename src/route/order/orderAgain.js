const mongodb = require('mongodb');
const handleError = require('./../utility/handleError');
const handleInternalError = require('./../utility/handleInternalError');
const isObjectId = require('./../../validator/isObjectId');
const isStencilData = require('./../../validate/stencilData/isStencilData');

function orderAgain(req, res) {
    const fileId = req.params.id;
    if(!isObjectId(fileId)) {
        handleError(res, { invalidRequestParameter: 'fileId' });
        return;
    }
    const orderData = req.body;
    const validationResult = isStencilData(orderData);
    if(!validationResult.valid) {
        handleError(res, validationResult);
        return;
    }
    const fileID = new mongodb.ObjectID(fileId);
    handleData(orderData, fileID, req.user, req.appShared.db, res);
}

async function handleData(orderData, fileID, user, db, res) {
    try {
        const fileCollection = db.collection('file');
        const file = await fileCollection.findOne({ _id: fileID }, { projection: { organizationID: true } });
        if(!file) {
            handleError(res, { couldNotFindFileWithId: fileID.toString() });
            return;
        }
        if(!file.organizationID.equals(user.organizationID)) {
            handleError(res, { permissionDeniedForFileWithId: fileID.toString() });
            return;
        }
        const orderID = new mongodb.ObjectID();
        const orderDocument = {
            _id: orderID,
            fileID,
            ...orderData,
            userID: user._id,
            organizationID: user.organizationID,
            date: new Date(),
            status: 'waiting'
        };
        const orderCollection = db.collection('order');
        try {
            const _result = await orderCollection.insertOne(orderDocument);
            res.status(200).json({ createdOrder: orderID });
        } catch(error) {
            handleInternalError({ fileID, user, orderDocument }, error, '[mongodb] Failed to find file', res, 'orderAgain');
        }
    } catch(error) {
        handleInternalError({ fileID, user }, error, '[mongodb] Failed to find file', res, 'orderAgain');
    }
}

module.exports = orderAgain;