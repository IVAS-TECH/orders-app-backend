const organizationMembersNameMap = require('./../dbQuery/organizationMembersNameMap');
const handleInternallError = require('./utility/handleInternalError');
const ordersInfo = require('./../dbQuery/ordersInfo');

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
    try {
        const orders = await ordersInfo(req.appShared.db, query, { }, nameMap);
        res.status(200).json({ activeOrders: orders });
    } catch(error) {
        handleInternallError({ user: req.user, query }, error, '[mongodb] call organizationMembersNameMap', res, 'findActiveOrders');
    }
}

module.exports = activeOrders;
