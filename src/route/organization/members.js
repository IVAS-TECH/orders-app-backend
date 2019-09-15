const handleInternalError = require('./../utility/handleInternalError');

async function members(req, res) {
    const userCollection = req.appShared.db.collection('user');
    const query = { organizationID: req.user.organizationID };
    const options = { projection: { _id: true, name: true } };
    try {
        const members = await userCollection.find(query, options).toArray();
        res.status(200).json({ members });
    } catch(error) {
        handleInternalError({ query }, error, '[mongodb] Failed to find users', res, 'findUsers');
    }
}

module.exports = members;