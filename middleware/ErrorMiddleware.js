class ErrorMiddleware {

    static logErrors(err, req, res, next) {
        console.error('logErrors', err.toString());
        next(err);
    }

    static clientErrorHandler(err, req, res, next) {
        console.error('clientErrors ', err.toString());
        res.send(500, {error: err.toString()});
        if (req.xhr) {
            console.error(err);
            res.send(500, {error: err.toString()});
        } else {
            next(err);
        }
    }

    static errorHandler(err, req, res, next) {
        console.error('lastErrors ', err.toString());
        res.send(500, {error: err.toString()});
    }

    static ignoreRequest(req, res, next) {
        res.status(204);
        res.end();
    }

}

ErrorMiddleware.db = null;
module.exports = ErrorMiddleware;