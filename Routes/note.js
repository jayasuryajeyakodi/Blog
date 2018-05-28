var Note = require("../models/Note"),
    express = require('express');

var router = express.Router();

router.get("/note", function (req, res) {
    Note.find({}, function (err, data) {
        if (err) {
            console.log("error fetching data :" + err);
        } else if (data != null && data != undefined) {
            res.render("NoteIndex", { Notes: data });
        }
    })

});

router.get("/note/new", function (req, res) {
    res.render("NewNote");
})

router.post("/note", function (req, res) {
    var note = req.body.Note;
    Note.create(note);
    res.redirect("/note");
})

router.get("/note/:id", function (req, res) {
    Note.findById(req.params.id, function (err, data) {
        if (err) {
            console.log("Error fetching the doc" + err);
        }
        else if (!(data == null || data == undefined)) {
            res.render("ShowNote", { Note: data });
        }
    })
})

router.put("/note/:id", function (req, res) {
    console.log(req.body.Note);
    Note.findByIdAndUpdate(req.params.id, req.body.Note, function (err, data) {
        if (err) {
            console.log("error updating the Note:" + err);
        }
        res.redirect("back");
    })
})

router.delete("/note/:id", function (req, res) {
    Note.findByIdAndRemove(req.params.id, function (err, data) {
        if (err) {
            console.log("error deleting" + err);
        }
        res.redirect("/note");
    })
})

module.exports = router;