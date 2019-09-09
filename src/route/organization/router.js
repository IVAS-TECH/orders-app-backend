const express = require('express');
const authUser = require('./../../middleware/authUser');
const members = require('./members');

const router = express.Router();

router.use(authUser);

router.get('/members', members);

module.exports = router;