const isISODate = require('./../validator/isISODate');
const isOrderStatus = require('./../validator/isOrderStatus');
const isObjectId = require('./../validator/isObjectId');
const isArchiveFileExtention = require('./../validator/isArchiveFileExtention');
const isString = require('./../validator/isString');
const isArrayOf = require('./isArrayOf');
const validate = require('./validate');

const isOrderQuery = validate({
    startDate: isISODate,
    endDate: isISODate,
    status: isArrayOf(isOrderStatus.validate, isOrderStatus.orderStatus),
    orderedBy: isArrayOf(isObjectId),
    fileExtention: isArrayOf(isArchiveFileExtention.validate, isArchiveFileExtention.archiveFileExtention),
    fileName: val => isString(val) && (val.length < 256)
});

module.exports = isOrderQuery;