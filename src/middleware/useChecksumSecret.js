function useChecksumSecret(secret) {
    return (req, _res, next) => {
        req.appShared.checksumSecret = secret;
        next();
    };
}

module.exports = useChecksumSecret;