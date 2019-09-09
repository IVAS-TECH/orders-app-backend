const express = require('express');
const userRouter = require('./user/router');
const organizationRouter = require('./organization/router');
const orderRouter = require('./order/router');
const authUser = require('./../middleware/authUser');
const activeOrders = require('./activeOrders');
const downloadFile = require('./downloadFile');

const apiRouter = new express.Router();

apiRouter.use('/user', userRouter);
apiRouter.use('/organization', organizationRouter);
apiRouter.use('/order', orderRouter);
apiRouter.get('/activeOrders', authUser, activeOrders);
apiRouter.get('/file/:id/:name', authUser, downloadFile);

module.exports = apiRouter;