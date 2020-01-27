const responseHelper = require('./../lib/responseHelper');
const mongoose = require('mongoose');
const validator = require('validator');
const bookModel = require('./../model/book');
const userModel = require('./../model/user');
const reservationModel = require('./../model/reservation');

class UserController {

    static async create(request, response) {
        try {
            const name = request.body.name;

            let records = await userModel.find({'name': name});
            if (records.length === 0) {
                let user = new userModel();
                user.name = name;

                let error = user.validateSync();
                if (error && error.errors.length) {
                    return responseHelper.send(response, error.errors, responseHelper.status.clientError.badRequest.statusCode);
                }

                let output = await user.save();
                return responseHelper.send(response, output, responseHelper.status.success.created.statusCode);
            } else {
                return responseHelper.send(response, 'existing record', responseHelper.status.clientError.badRequest.statusCode, true);
                // throw new Error('existing record');
            }
        } catch (exception) {
            return await UserController.catcher(request, response, exception, null);
        }
    }

    static async getAll(request, response) {
        try {
            let records = await userModel.find({});
            return responseHelper.send(response, records, responseHelper.status.success.ok.statusCode);
        } catch (exception) {
            return await UserController.catcher(request, response, exception, null);
        }
    }

    static async getSingleById(request, response) {
        try {
            const userId = request.params.userId;
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return responseHelper.send(response, 'userId not valid', responseHelper.status.clientError.badRequest.statusCode);
            }
            let record = await userModel.findById(userId).populate('reservations').populate({
                path: 'reserved',
                match: {status: 1}
            });
            return responseHelper.send(response, record, responseHelper.status.success.ok.statusCode);
        } catch (exception) {
            return await UserController.catcher(request, response, exception, null);
        }
    }

    static async borrowBook(request, response) {
        try {
            const userId = request.params.userId;
            const bookId = request.params.bookId;

            let user = await userModel.findById(userId);
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return responseHelper.send(response, 'userId not valid', responseHelper.status.clientError.badRequest.statusCode, true);
            }
            let book = await bookModel.findById(bookId);
            if (!mongoose.Types.ObjectId.isValid(bookId)) {
                return responseHelper.send(response, 'bookId not valid', responseHelper.status.clientError.badRequest.statusCode, true);
            }

            let existingReservation = await reservationModel.findOne({
                bookId: book.id,
                status: 1
            });
            if (existingReservation) {
                return responseHelper.send(response, 'book already reserved', responseHelper.status.clientError.badRequest.statusCode, true);
            }

            let reservation = new reservationModel();
            reservation.bookId = book.id;
            reservation.userId = user.id;
            reservation.status = 1;

            let error = reservation.validateSync();
            if (error && error.errors.length) {
                return responseHelper.send(response, error.errors, responseHelper.status.clientError.badRequest.statusCode, true);
            }

            let output = await reservation.save();

            return responseHelper.send(response, true, responseHelper.status.success.ok.statusCode);
        } catch (exception) {
            return await UserController.catcher(request, response, exception, null);
        }
    }

    static async returnBook(request, response) {
        try {
            const userId = request.params.userId;
            const bookId = request.params.bookId;
            const score = request.body.score;

            let user = await userModel.findById(userId);
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return responseHelper.send(response, 'userId not valid', responseHelper.status.clientError.badRequest.statusCode, true);
            } else if (!user) {
                return responseHelper.send(response, 'user not found', responseHelper.status.clientError.badRequest.statusCode, true);
            }

            let book = await bookModel.findById(bookId);
            if (!mongoose.Types.ObjectId.isValid(bookId)) {
                return responseHelper.send(response, 'bookId not valid', responseHelper.status.clientError.badRequest.statusCode, true);
            } else if (!book) {
                return responseHelper.send(response, 'book not found', responseHelper.status.clientError.badRequest.statusCode, true);
            }

            let reservation = await reservationModel.findOne({
                userId: user.id,
                bookId: book.id,
                status: 1
            });
            if (reservation) {
                reservation.bookId = book.id;
                reservation.userId = user.id;
                reservation.status = 0;
                reservation.score = score;

                let error = reservation.validateSync();
                if (error && error.errors.length) {
                    return responseHelper.send(response, error.errors, responseHelper.status.clientError.badRequest.statusCode, true);
                }

                let output = await reservation.save();
                return responseHelper.send(response, true, responseHelper.status.success.ok.statusCode);
            }

            return responseHelper.send(response, 'this user has no reservation for this book', responseHelper.status.clientError.badRequest.statusCode, true);

        } catch (exception) {
            return await UserController.catcher(request, response, exception, null);
        }
    }

    static async catcher(request, response, exception, details) {
        let log = {
            controller: UserController.controllerName,
            exception: exception.message || exception,
            // details: [details, exception]
        };

        return responseHelper.send(response, log, responseHelper.status.serverError.internalServerError.statusCode, true);
    }

}

UserController.controllerName = 'UserController';
module.exports = UserController;