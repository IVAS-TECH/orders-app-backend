const mongodb = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const useDB = require('./middleware/useDB');
const addJWT = require('./middleware/jwt');
const userRouter = require('./route/user/router');

function server({ host, port, dbURL, dbName, jwtSecret }) {
    const mongoDBOptions = {
        // useUnifiedTopology: true,
        useNewUrlParser: true
    };

    const mongoClient = new mongodb.MongoClient(dbURL, mongoDBOptions);

    return new Promise(async (resolve, reject) => {
        try {
            const connectedClient = await mongoClient.connect();
            const db = connectedClient.db(dbName);
            const app = express();
            app.use(useDB(db));
            app.use(addJWT(jwtSecret));
            app.use(bodyParser.json());
            app.use('/user', userRouter);
            app.listen(port, host, resolve);
        } catch(err) {
            reject(err);
        }
    });
}

module.exports = server;