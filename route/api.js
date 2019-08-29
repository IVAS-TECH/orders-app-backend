const express = require('express');
const userRouter = require('./user/router');

const apiRouter = new express.Router();
apiRouter.use('/user', userRouter);

module.exports = apiRouter;