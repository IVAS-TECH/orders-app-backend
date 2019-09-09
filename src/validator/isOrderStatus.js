const isInArray = require('./isInArray');

const orderStatus = [
    'waiting',
    'accepted',
    'rejected',
    'canceled',
    'procssing',
    'ready',
    'delivered'
];

const validate = isInArray(orderStatus);

module.exports = { validate, orderStatus };