const   mongoose                = require("mongoose"),
        passportLocalMongoose   = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    isActive: Boolean,
    role: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    description: String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);