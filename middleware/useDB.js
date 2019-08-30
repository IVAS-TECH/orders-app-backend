function useDB(db) {
    return (req, _res, next) => {
        req.appShared.db = db;
        next();
    };
}

module.exports = useDB;