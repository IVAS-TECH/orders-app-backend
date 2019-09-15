const handleInternalError = require('./../utility/handleInternalError');

async function organization(req, res) {
    const db = req.appShared.db;
    const organizationCollection = db.collection('organization');
    const userCollection = db.collection('user');
    const { organizationID } = req.user;
    const userOptions = { projection: { _id: true, name: true, email: true, phone: true } };
    try {
        const [ organization, members ] = await Promise.all([
            organizationCollection.findOne({ _id: organizationID }),
            userCollection.find({ organizationID }, userOptions).toArray()
        ]);
        const manager = members.find(({ _id }) => _id.equals(organization.managerID));
        const users = members.filter(member => member != manager);
        res.status(200).json({
            organization: {
                name: organization.name,
                manager: removeId(manager),
                users: users.map(removeId)
            }
        });
    } catch(error) { 
        handleInternalError({ user: req.user }, error, '[mongodb] Failed to find organization data', res, 'findOrganizationData');
    }
}

function removeId({ _id, ...user }) {
    return user;
}

module.exports = organization;
