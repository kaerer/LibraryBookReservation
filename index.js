const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const morgan = require('morgan');
const path = require('path');
const ResponseMiddleware = require('./middleware/ResponseMiddleware');
const MongoMiddleware = require('./middleware/MongoMiddleware');
const ErrorMiddleware = require('./middleware/ErrorMiddleware');

require('dotenv').config();

const port = /*process.env.PORT || */3000;

app.set('x-powered-by', false);
app.set('etag', false);
app.set('cache', false);

app.use('/favicon.ico', ErrorMiddleware.ignoreRequest);
app.use('/robots.txt', ErrorMiddleware.ignoreRequest);

// Middleware Usage
app.use(ResponseMiddleware.setHeaders);
app.use(MongoMiddleware.setConnection);

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});
app.use(morgan('combined', {stream: accessLogStream}));

// app.use(ErrorMiddleware.logErrors);
// app.use(ErrorMiddleware.clientErrorHandler);
// app.use(ErrorMiddleware.errorHandler);

// app.use(express.json({limit: '10MB'})); // apply body parser as middleware on all routes
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const UserRoutes = require('./routes/UserRoutes');
const BookRoutes = require('./routes/BookRoutes');

app.use('/users', UserRoutes);
app.use('/books', BookRoutes);

app.get('*', ResponseMiddleware.notFound);
app.listen(port, function () {
    console.log('Started on port ' + port);
});
