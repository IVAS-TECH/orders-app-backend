const express = require('express');
const userRouter = require('./user/router');
const organizationRouter = require('./organization/router');
const orderRouter = require('./order/router');

const apiRouter = new express.Router();

apiRouter.use('/user', userRouter);
apiRouter.use('/organization', organizationRouter);
apiRouter.use('/order', orderRouter);

module.exports = apiRouter;