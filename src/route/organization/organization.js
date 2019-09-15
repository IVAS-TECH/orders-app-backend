const handleInternalError = require('./../utility/handleInternalError');

async function organization(req, res) {
    const userCollection = req.appShared.db.collection('user');
    const { organizationID } = req.user;
    const query = { organizationID };
    const options = { projection: { name: true, email: true, phone: true, role: true } };
    try {
        const members = await userCollection.find(query, options).toArray();
        const manager = members.find(({ role }) => role === 'organizationManager');
        const users = members.filter(member => member != manager);
        res.status(200).json({
            organization: {
                manager: removeRole(manager),
                users: users.map(removeRole)
            }
        });
    } catch(error) { 
        handleInternalError({ query }, error, '[mongodb] Failed to find users', res, 'findUsers');
    }
}

function removeRole({ role, ...user }) {
    return user;
}

module.exports = organization;