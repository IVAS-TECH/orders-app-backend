const parseISO = require('date-fns/parseISO');
const mongodb = require('mongodb');

function convert({
    startDate,
    endDate,
    orderedBy,
    fileExtention,
    fileName
}) {
    return {
        startDate: parseISO(startDate),
        endDate: parseISO(endDate),
        orderedBy: orderedBy.map(id => new mongodb.ObjectID(id)),
        fileExtention,
        fileName
    };
}

module.exports = convert;