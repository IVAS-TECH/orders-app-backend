const mongodb = require('mongodb');
const multer = require('multer');
const uuidv4 = require('uuid/v4');
const base64URL = require('base64url');
const handleError = require('./../utility/handleError');
const handleInternalError = require('./../utility/handleInternalError');
const isString = require('./../../validator/isString');
const isStencilData = require('./../../validate/stencilData/isStencilData');

const storage = multer.diskStorage({
    destination: 'tmpFiles',
    filename: (_req, file, nameFile) => {
        const fileName = base64URL.encode(file.originalname);
        const uuid = uuidv4();
        nameFile(null, fileName + uuid);
    }
});

const upload = multer({
    storage,
    limits: {
        fieldNameSize: 20,
        fieldSize: 10000,
        fields: 1,
        fileSize: 100000000,
        files: 1,
        parts: 2,
        headerPairs: 200
    }
}).single('archive');

// const data = JSON.parse(req.body.data)
// const url = req.file.archive.path
// const mimeType = req.file.acrive.mimetype
// <a href={url} download={data.fileName} type={mimeType} /> 

function makeOrder(req, res) {
    upload(req, res, err => {
        if(err) {
            if(err instanceof multer.MulterError) {
                handleError(res, { invalidData: 'notAValidOrderData' });
            } else {
                handleInternalError(
                    { data: req.body.data, file: req.file },
                    error,
                    'Fail to receive order data',
                    res, 'notReceivedOrderData'
                );
            }
            return;
        }
        if(!isString(req.body.data)) {
            handleError(res, { invalidData: 'notAString' });
            return;
        }
        try {
            const data = JSON.parse(req.body.data);
            handleData(data, extractFileData(req.file), req.user, req.appShared.db, res);
        } catch(error) {
            handleError(res, { invalidData: 'notAJSON' });
        }
    });
}

async function handleData(orderData, fileData, user, db, res) {
    const validationResult = isStencilData(orderData);
    if(!validationResult.valid) {
        handleError(res, validationResult);
        return;
    }
    const orderID = new mongodb.ObjectID();
    const fileID = new mongodb.ObjectID();
    const fileDocument = {
        _id: fileID,
        orderID,
        ...fileData
    };
    const orderDocument = {
        _id: orderID,
        fileID,
        ...orderData,
        userID: user._id,
        organizationID: user.organizationID,
        date: new Date()
    };
    try {
        const orderCollection = db.collection('order');
        const fileCollection = db.collection('file');
        const _result = await Promise.all([
            orderCollection.insertOne(orderDocument),
            fileCollection.insertOne(fileDocument)
        ]);
        res.status(200).json({ createdOrder: orderID });
    } catch(error) {
        // hadle error (remove from collections)
        // delete file
        handleInternalError({ document }, error, '[mongodb] Failed to inser', res, 'makeOrder');
    }
}

function extractFileData({
    encoding,
    mimetype,
    filename,
    size
}) {
    return {
        encoding,
        mimetype,
        filename,
        size
    };
}

module.exports = makeOrder;