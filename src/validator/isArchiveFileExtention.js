const isInArray = require('./isInArray');

const archiveFileExtention = ['.zip', '.rar', '.targ.gz', '.tgz'];

const validate = isInArray(archiveFileExtention);

module.exports = {
    validate,
    archiveFileExtention
};