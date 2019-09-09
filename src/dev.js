const dotenv = require('dotenv');
const server = require('./server');

dotenv.config();

const port = process.env.PORT;
const host = process.env.HOST;

async function dev() {
    try {
        await server({
            host,
            port,
            dbURL: process.env.DATABASE_URL,
            dbName: process.env.DATABASE_NAME,
            jwtSecret: process.env.JWT_SECRET,
            checksumSecret: process.env.CHECKSUM_SECRET
        });
        console.log(`server listening on port: http://${host}:${port}`);
    } catch(error) {
        console.log(error.message);
    }
}

dev();