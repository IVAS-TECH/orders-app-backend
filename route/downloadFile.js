function downloadFile(req, res) {
    console.log(req.params);
    res.sendStatus(200);
}

module.exports = downloadFile;