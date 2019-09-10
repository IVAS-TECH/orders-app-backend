const express = require('express');
const initalQuery = require('./initialQuery');

const router = express.Router();

router.post('/:size', initalQuery);

module.exports = router;
