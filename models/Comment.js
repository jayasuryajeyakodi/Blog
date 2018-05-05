var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    username: String,
    description: String,
});

module.exports = mongoose.model("Comment", commentSchema);