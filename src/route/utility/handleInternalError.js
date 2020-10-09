function handleInternalError(data, { name, message }, logMessage, res, reason) {
    const logInfo = {
        data,
        error: {
            name: error.name,
            message: error.message
        },
        time: new Date().toISOString()
    };
    console.log(logMessage);
    console.log({
        ...logInfo,
        error: { name, message },
        time: new Date().toISOString()
    });
    if(res) {
        res.status(500).json({ error: { reason } });
    }
}

module.exports = handleInternalError;