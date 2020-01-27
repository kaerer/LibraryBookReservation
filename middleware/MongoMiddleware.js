const mongoose = require('mongoose');

class MongoMiddleware {

    static async setConnection(request, response, next) {
        if (!MongoMiddleware.db) {
            const db = await MongoMiddleware.connect();
            MongoMiddleware.setDB(db);
        }

        next();
    }

    static async connect() {
        console.log('MongoMiddleware connect');
        // connect to our database
        await mongoose.connect(process.env.MONGO_CONNECTION_URI, {
            keepAlive: 1,
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        const connection = mongoose.connection;

        connection.on('error', console.error.bind(console, 'connection error:'));
        return connection;
    }

    static setDB(db) {
        if (db) {
            MongoMiddleware.db = db;
        }
    }

    static getDB() {
        return MongoMiddleware.db;
    }

}

MongoMiddleware.db = null;
module.exports = MongoMiddleware;