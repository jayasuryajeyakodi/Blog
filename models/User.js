var mongoose = require('mongoose');
var mongoosePassport = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

userSchema.plugin(mongoosePassport);

module.exports = mongoose.model("User", userSchema);