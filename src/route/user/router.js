const express = require('express');
const createOrganizationManager = require('./createOrganizationManager');
const login = require('./login');
const register = require('./register');

const router = express.Router();

router.post('/organizationManager', createOrganizationManager);
router.post('/login', login);
router.post('/register/:organization', register);

module.exports = router;