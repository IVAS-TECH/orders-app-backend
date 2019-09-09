const express = require('express');
const authUser = require('./../../middleware/authUser');
const makeOrder = require('./makeOrder');
const fetchOrderData = require('./fetchOrderData');

const router = express.Router();

router.use(authUser);   

router.post('/', makeOrder);
router.get('/:id', fetchOrderData);

module.exports = router;