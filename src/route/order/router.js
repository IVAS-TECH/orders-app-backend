const express = require('express');
const authUser = require('./../../middleware/authUser');
const makeOrder = require('./makeOrder');
const fetchOrderData = require('./fetchOrderData');
const queryRouter = require('./query/router');

const router = express.Router();

router.use(authUser);   

router.use('/query', queryRouter);

router.post('/', makeOrder);
router.get('/:id', fetchOrderData);

module.exports = router;