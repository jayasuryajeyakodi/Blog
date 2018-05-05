var mongoose = require('mongoose');
// Please remember to set default values to the elements are do some validation, else the field 
// is empty in the DB.
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    createdDate: {
        type: Date,
        default: Date.now
    },
    comments : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

var Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;