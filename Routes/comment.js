
var express = require('express');
var router = express.Router();
var Comment = require('../models/Comment'),
    Blog = require('../models/Blog'),
    middleware = require("../middleware");

 // handle the request to edit the comment
router.put("/blogs/:id/comment/:commentId", middleware.hasCommentPermission, function(req, res){
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, data){
        if(err){
            console.log("error "+err)
        }
        req.flash("success","comment edited");
        res.redirect("/blogs/"+req.params.id)
    })
})

//handle the request to delete the comment
router.delete("/blogs/:id/comment/:commentId", middleware.hasCommentPermission, function(req, res){
    Comment.findByIdAndRemove(req.params.commentId, function(err, data){
        if(err){
            console.log('error deleting comment'+err);
        }
        req.flash("success","delted");
        res.redirect("back");
    })
})   
// show the form to add a new comment
router.get("/blogs/:id/comment",middleware.isLoggedin, function (req, res) {
    res.render("AddComment", { blogId: req.params.id });
})

// show a form to edit the comment
router.get("/blogs/:id/comment/:commentId/edit",middleware.hasCommentPermission, function (req, res) {
    Comment.findById(req.params.commentId, function(err, data){
        if(err){
            console.log("error in showing edit comment form"+err)
        }
        res.render("EditComment", {blogId:req.params.id, comment:data});
    })
})

// handle the request to add a comment
// todo: should be post route ideally
router.put("/blogs/:id/comment",middleware.isLoggedin, function (req, res) {
    var comment = req.body.comment;
    comment.user= req.user._id;
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
                req.flash("success", "comment added");
                res.redirect("/blogs/" + req.params.id);
            });
        }
    })
})

module.exports = router;