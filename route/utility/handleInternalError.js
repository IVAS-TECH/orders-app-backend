function handleInternalError(logInfo, { name, message }, logMessage, res, resError) {
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
        res.status(500).json({ error: resError });
    }
}

module.exports = handleInternalError;