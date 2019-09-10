const isInArray = require('./isInArray');

const orderStatus = [
    'waiting',
    'accepted',
    'rejected',
    'canceled',
    'processing',
    'ready',
    'delivered'
];

const validate = isInArray(orderStatus);

module.exports = { validate, orderStatus };