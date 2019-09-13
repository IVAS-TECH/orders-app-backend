const express = require('express');
const authUser = require('./../../middleware/authUser');
const makeOrder = require('./makeOrder');
const fetchOrderData = require('./fetchOrderData');
const queryRouter = require('./query/router');
const orderAgain = require('./orderAgain');

const router = express.Router();

router.use(authUser);   

router.use('/query', queryRouter);

router.post('/', makeOrder);
router.get('/:id', fetchOrderData);
router.post('/file/:id', orderAgain);

module.exports = router;