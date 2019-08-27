function useDB(db) {
    return (req, _res, next) => {
        req.db = db;
        next();
    };
}

module.exports = useDB;