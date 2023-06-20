const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

    email: {
        type: String,
        required: [true, 'Email is a required field'],
        unique: [true, 'Email Exist']
    },


    password: {
        type: String,
        required: [true, 'Password is a required field'],
        unique: false,
    }
})

module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);