const mongodb = require('mongodb');
const handleError = require('../utility/handleError');
const handleInternalError = require('../utility/handleInternalError');
const isObjectId = require('../../validator/isObjectId'); 

async function fetchOrderData(req, res) {
    const id = req.params.id;
    if(!isObjectId(id)) {
        handleError(res, { invalidData: 'notAValidID' });
        return;
    }
    const _id = new mongodb.ObjectID(id);
    const orderCollection = req.appShared.db.collection('order');
    try {
        const order = await orderCollection.findOne({ _id });
        if(order === null) {
            handleError(res, { orderNotFound: id });
            return;
        }
        const { userID, organizationID, ...orderData } = order;
        if(!organizationID.equals(req.user.organizationID)) {
            handleError(res, { permissionDenied: true });
        } else {
            res.status(200).json({ order: orderData });
        }
    } catch(error) {
        handleInternalError({ id, user: req.user }, error, '[mongodb] Failed to find order', res, 'fechOrder');
    }
}

module.exports = fetchOrderData;