let responseHelper = {
    status: {
        success: {
            ok: {
                statusCode: 200,
                message: "OK"
            },
            created: {
                statusCode: 201,
                message: "Created"
            },
            noContent: {
                statusCode: 204,
                message: "No Content"
            }
        },
        redirection: {
            notModified: {
                statusCode: 304,
                message: "Not Modified"
            }
        },
        clientError: {
            badRequest: {
                statusCode: 400,
                message: "Bad Request"
            },
            unauthorized: {
                statusCode: 401,
                message: "Unauthorized"
            },
            forbidden: {
                statusCode: 403,
                message: "Forbidden"
            },
            notFound: {
                statusCode: 404,
                message: "Not Found"
            },
            conflict: {
                statusCode: 409,
                message: "Conflict"
            }
        },
        serverError: {
            internalServerError: {
                statusCode: 500,
                message: "Internal Server Error"
            }
        }
    },
    send: function (response, value, statusCode, error, additionalOutput) {
        let _output = {};

        statusCode = statusCode || responseHelper.status.success.ok.statusCode;

        _output.result = value;
        _output.datetime = (new Date()).toUTCString();

        if (error) {
            _output.error = error;
        } else if (typeof additionalOutput !== 'undefined') {
            _output = {..._output, ...additionalOutput}
        }

        return response.status(statusCode).json(_output).end();
    }
};

module.exports = responseHelper;
