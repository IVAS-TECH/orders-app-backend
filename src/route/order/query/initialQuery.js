const handleError = require('./../../utility/handleError');
const handleInternalError = require('./../../utility/handleInternalError');
const isCount = require('./../../../validator/isCount');
const isOrderQuery = require('./../../../validate/isOrderQuery'); 
const orderFilterFromJSON = require('./utility/orderFilterFromJSON');
const dbQueryFromOrderFilter = require('./utility/dbQueryFromOrderFilter');
const ordersInfo = require('./../../../dbQuery/ordersInfo');

async function initalQuery(req, res) {
    const limit = Number(req.params.size);
    if(!isCount(limit)) {
        handleError(res, { invalidRequestParameter: 'size' });
        return;
    }
    const validationResult = isOrderQuery(req.body);
    if(!validationResult.valid) {
        handleError(res, validationResult);
        return;
    }
    const data = orderFilterFromJSON(req.body);
    const { organizationID } = req.user;
    const query = dbQueryFromOrderFilter({ ...data, organizationID });
    const db = req.appShared.db;
    try {
        const [count, orders] = await Promise.all([
            db.collection('order').find(query).count(),
            ordersInfo(db, query, { limit })
        ]);
        res.status(200).json({ count, orders });
    } catch(error) {
        handleInternalError({ data, user: req.user, query }, error, '[mongodb] Failed to find orders', res, 'initailOrderQuery');
    }
}

module.exports = initalQuery;
