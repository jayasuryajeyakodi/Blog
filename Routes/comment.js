
var express = require('express');
var router = express.Router();
var Comment = require('../models/Comment'),
    Blog = require('../models/Blog');
    
router.get("/blogs/:id/comment", function (req, res) {
    res.render("AddComment", { blogId: req.params.id });
})

router.put("/blogs/:id/comment", function (req, res) {
    var comment = req.body.comment;
    var commentCreated;

    Blog.findById(req.params.id, function (err, blog) {
        if (err) {
            console.log(err);
        }
        else {
            Comment.create(comment, function (err, comment) {
                blog.comments.push(comment);
                blog.save();
                console.log("updated blog with comment"+blog);
                res.redirect("/blogs/" + req.params.id);
            });

        }
    })
})

module.exports = router;