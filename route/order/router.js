const express = require('express');
const authUser = require('./../../middleware/authUser');
const makeOrder = require('./makeOrder');

const router = express.Router();

router.use(authUser);   

router.post('/', makeOrder);

module.exports = router;