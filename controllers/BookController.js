const responseHelper = require('./../lib/responseHelper');
const mongoose = require('mongoose');
const bookModel = require('./../model/book');
const reservationModel = require('./../model/reservation');

class BookController {

    static async create(request, response) {
        try {
            const name = request.body.name;
            let records = await bookModel.find({'name': name});
            if (records.length === 0) {
                let book = new bookModel();
                book.name = name;
                let error = book.validateSync();
                if (error && error.errors.length) {
                    return responseHelper.send(response, error.errors, responseHelper.status.clientError.badRequest.statusCode);
                }

                let output = await book.save();
                return responseHelper.send(response, output, responseHelper.status.success.created.statusCode);
            } else {
                return responseHelper.send(response, 'existing record', responseHelper.status.clientError.badRequest.statusCode, true);
            }
        } catch (exception) {
            return await BookController.catcher(request, response, exception, null);
        }
    }

    static async getAll(request, response) {
        try {
            let records = await bookModel.find({});
            return responseHelper.send(response, records, responseHelper.status.success.ok.statusCode);
        } catch (exception) {
            return await BookController.catcher(request, response, exception, null);
        }
    }

    static async getSingleById(request, response) {
        try {
            const bookId = request.params.bookId;
            if (!mongoose.Types.ObjectId.isValid(bookId)) {
                return responseHelper.send(response, 'ID not valid', responseHelper.status.clientError.badRequest.statusCode);
            }

            let record = await bookModel.findById(mongoose.Types.ObjectId(bookId));
            if (!record) {
                return responseHelper.send(response, null, responseHelper.status.clientError.notFound.statusCode);
            }

            let details = await reservationModel.aggregate([
                {$match: {bookId: record.id, status: 0}},
                {$group: {_id: record.id, averageScore: {$avg: '$score'}}}
            ]);

            record = record.toObject();
            record['details'] = details[0];
            delete record['details']['_id'];

            return responseHelper.send(response, record, responseHelper.status.success.ok.statusCode);
        } catch (exception) {
            return await BookController.catcher(request, response, exception, null);
        }
    }

    static async catcher(request, response, exception, details) {
        let log = {
            controller: BookController.controllerName,
            exception: exception.message || exception,
            // details: [details, exception]
        };

        return responseHelper.send(response, log, responseHelper.status.serverError.internalServerError.statusCode, true);
    }

}

BookController.controllerName = 'BookController';
module.exports = BookController;