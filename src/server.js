const mongodb = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const createAppShared = require('./middleware/createAppShared');
const useDB = require('./middleware/useDB');
const addJWT = require('./middleware/jwt');
const useChecksumSecret = require('./middleware/useChecksumSecret');
const apiRouter = require('./route/api');

function server({ host, port, dbURL, dbName, jwtSecret, checksumSecret }) {
    const mongoDBOptions = {
        // useUnifiedTopology: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    };

    console.log(arguments[0]);
    const mongoClient = new mongodb.MongoClient(dbURL, mongoDBOptions);

    return new Promise(async (resolve, reject) => {
        try {
            const connectedClient = await mongoClient.connect();
            const db = connectedClient.db(dbName);
            const app = express();
            app.use(createAppShared)
            app.use(useDB(db));
            app.use(addJWT(jwtSecret));
            app.use(useChecksumSecret(checksumSecret));
            app.use(bodyParser.json());
            app.use(express.static("./build"));
            app.use('/api', apiRouter);
            app.listen(port, host, resolve);
        } catch(err) {
            reject(err);
        }
    });
}

module.exports = server;