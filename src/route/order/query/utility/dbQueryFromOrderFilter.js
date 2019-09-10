const escapeStringRegExp = require('escape-string-regexp');

function dbQuery({
    startDate,
    endDate,
    orderedBy,
    fileExtention,
    fileName,
    organizationID
}) {
    const fileExtentionRegExpString
        = fileExtention
        .map(escapeStringRegExp)
        .reduce((regExpStr, extStr) => regExpStr + '|' + extStr);
    return {
        organizationID,
        date: {
            $gte: startDate,
            $lte: endDate
        },
        userID: { $in: orderedBy },
        fileName: { $regex: new RegExp(fileName
            ? fileNameRegExpString(fileName, fileExtentionRegExpString)
            : fileExtentionRegExpString
        ) }
    };
}

module.exports = dbQuery;

function fileNameRegExpString(fileName, fileExtentionRegExpString) {
    const fileNameRegExpStr
        = escapeStringRegExp(fileName + '*')
        .replace(new RegExp('(\\\\\\*)+', 'g'), '.*')
        .replace(new RegExp('\\\\\\?', 'g'), '.');
    return `${fileNameRegExpStr}(?:${fileExtentionRegExpString})`;
}