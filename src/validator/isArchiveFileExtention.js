const isInArray = require('./isInArray');

const archiveFileExtention = ['.zip', '.rar', '.tar.gz', '.tgz'];

const validate = isInArray(archiveFileExtention);

module.exports = {
    validate,
    archiveFileExtention
};