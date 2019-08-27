const express = require('express');
const createOrganizationManager = require('./createOrganizationManager');
const login = require('./login');

const router = express.Router();

router.post('/organizationManager', createOrganizationManager);
router.post('/login', login);

module.exports = router;