const multer = require('multer');
const uuidv4 = require('uuid/v4');
const base64URL = require('base64url');

const storage = multer.diskStorage({
    destination: 'tmpFiles',
    filename: (_req, file, nameFile) => {
        const fileName = base64URL.encode(file.originalname);
        const uuid = uuidv4();
        nameFile(null, `${fileName}-${uuid}`);
    }
});

const upload = multer({
    storage,
    limits: {
        fieldNameSize: 20,
        fieldSize: 10000,
        fields: 1,
        fileSize: 100000000,
        files: 1,
        parts: 2,
        headerPairs: 200
    }
}).single('archive');

// const data = JSON.parse(req.body.data)
// const url = req.file.archive.path
// const mimeType = req.file.acrive.mimetype
// <a href={url} download={data.fileName} type={mimeType} /> 

function makeOrder(req, res) {
    upload(req, res, err => {
        console.log(req.body);
	    console.log({
            file: req.file,
            err
        });
        res.status(200).json({ test: true });
    });
}

module.exports = makeOrder;