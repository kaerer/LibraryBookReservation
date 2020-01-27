const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schemaToOptions = {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret, options) {
        delete ret._id;
        return ret;
    }
};

const schemaOptions = {
    toObject: schemaToOptions,
    toJSON: schemaToOptions
};

const UserSchema = new Schema({
    name: {type: Schema.Types.String, required: true, trim: [true, 'Name required']},
    created: {type: Schema.Types.Date, default: Date.now, required: true}
}, schemaOptions);

const reservationsDefinition = {
    ref : 'Reservation',
    localField : '_id',
    foreignField : 'userId',
};

UserSchema.virtual('reserved', reservationsDefinition);
UserSchema.virtual('reservations', reservationsDefinition);

UserSchema.virtual('id').get(function () {
    return this._id;
});

module.exports = mongoose.model('User', UserSchema);