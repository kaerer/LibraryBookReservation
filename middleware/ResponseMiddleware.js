const os = require('os');

class ResponseMiddleware {
    //- try https://github.com/expressjs/cors ?
    static setHeaders(request, response, next) {
        response.set({
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Method": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "X-Prefix, Origin, Content-Type",
            "Access-Control-Expose-Headers": "X-Result, X-Error, X-Source",
            "X-Source": os.hostname().split('-').pop()
        });
        next();
    }

    static notFound(req, res) {
        res.sendStatus(404);
    }
}

module.exports = ResponseMiddleware;