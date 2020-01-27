const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schemaToOptions = {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret, options) {
        delete ret._id;
        delete ret.status;
        delete ret.userId;
        return ret;
    }
};

const schemaOptions = {
    toObject: schemaToOptions,
    toJSON: schemaToOptions
};

const ReservationSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: [true, 'User required']},
    bookId: {type: Schema.Types.ObjectId, ref: 'Book', required: [true, 'Book required']},
    score: {type: Schema.Types.Number, default: null, required: false, max: [10, 'max score 10'], min: [0, 'min score 0']},
    status: {type: Schema.Types.Number, default: 1, required: true, enum: [1, 0]},
    created: {type: Schema.Types.Date, default: Date.now, required: true},
}, schemaOptions);

// ReservationSchema.virtual('id').get(function () {
//     return this._id;
// });

module.exports = mongoose.model('Reservation', ReservationSchema);