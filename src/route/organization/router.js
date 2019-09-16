const express = require('express');
const authUser = require('./../../middleware/authUser');
const members = require('./members');
const organization = require('./organization');
const invite = require('./invite');

const router = express.Router();

router.use(authUser);

router.get('/', organization);
router.get('/members', members);
router.get('/invite', invite);

module.exports = router;
