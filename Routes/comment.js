
var express = require('express');
var router = express.Router();
var Comment = require('../models/Comment'),
    Blog = require('../models/Blog');
    
router.get("/blogs/:id/comment",isLoggedin, function (req, res) {
    res.render("AddComment", { blogId: req.params.id });
})

router.put("/blogs/:id/comment",isLoggedin, function (req, res) {
    var comment = req.body.comment;
    comment.username = req.user.username;

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
function isLoggedin(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }

    res.redirect("/login");
}
module.exports = router;