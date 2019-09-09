const organizationMembersNameMap = require('./../dbQuery/organizationMembersNameMap');
const handleInternallError = require('./utility/handleInternalError');

async function activeOrders(req, res) {
    try {
        const nameMap = await organizationMembersNameMap(req.appShared.db, req.user.organizationID);
        sendActiveOrders(nameMap, req, res);
    } catch(error) {
        handleInternallError({ user: req.user }, error, '[mongodb] call organizationMembersNameMap', res, 'fetchMembersNameMap');
    }
}

async function sendActiveOrders(nameMap, req, res) {
    const query = {
        organizationID: req.user.organizationID,
        status: { $in: ['waiting', 'accepted', 'processing', 'ready'] }
    };
    const options = {
        projection: { _id: true, userID: true, date: true, fileName: true, fileID: true, status: true }
    };
    const orderCollection = req.appShared.db.collection('order');
    try {
        const orders = await orderCollection.find(query, options).map(order => ({
            id: order._id,
            orderedBy: nameMap[order.userID],
            date: order.date.toISOString(),
            file: {
                name: order.fileName,
                id: order.fileID.toString()
            },
            status: order.status
        })).toArray();
        res.status(200).json({ activeOrders: orders });
    } catch(error) {
        handleInternallError({ user: req.user, query }, error, '[mongodb] call organizationMembersNameMap', res, 'findActiveOrders');
    }
}

module.exports = activeOrders;
