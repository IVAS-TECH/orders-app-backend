const base64URL = require('base64url');
const handleError = require('./../utility/handleError');
const handleInternalError = require('./../utility/handleInternalError');

async function invite(req, res) {
    if(req.user.role !== 'organizationManager') {
        handleError(res, { permissionDenied: true });
        return;
    }
    try {
        const token = await req.appShared.jwt.create({
            id: req.user.organizationID.toString()
        });
        const encoded = base64URL.encode(token);
        res.status(200).json({ organization: encoded });
    } catch(error) {
        handleInternalError({ user: req.user }, error, '[jwt] Failed to generate JWT', res, 'failedToInvite');
    }
}

module.exports = invite;
