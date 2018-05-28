var mongoose = require("mongoose");

var NoteSchema = new mongoose.Schema({
    Title: String,
    Content: String,
    CreatedDate: {
        type: Date,
        default: Date.now
    },
    ModifiedDate:{
        type: Date,
        default: Date.now
    }
})

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;