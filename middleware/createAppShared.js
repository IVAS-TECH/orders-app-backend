function createAppShared(req, res, next) {
    req.appShared = { };
    next();
}

module.exports = createAppShared;