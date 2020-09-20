const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const User = new Schema({

    // can be removed cause now we are using passport local mongoose
/*     username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,

    }, */
    admin: {
        type: Boolean,
        default: false
    }
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);