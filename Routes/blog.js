
var express = require('express');
var router = express.Router();
var Blog = require('../models/Blog');
var middleware = require("../middleware");

router.get("/blogs", middleware.isLoggedin,function (req, res) {
    Blog.find({
    }, function (err, blog) {
        res.render("index", { blogs: blog });
    })
});

// purposely placing this route above the id one cuase that will get hit first
router.get("/blogs/new", middleware.isLoggedin,function (req, res) {
    res.render("newBlogForm");
})

router.get("/blogs/:id", function (req, res) {
    Blog.findById(req.params.id).populate('comments').exec(function (err, blog) {
        if (err) {
            res.redirect("/");
        }
        else {
            console.log("populated " + blog);
            res.render("showSelectedBlog", { foundBlog: blog });
        }
    })
});

router.get("/blogs/:id/edit",middleware.hasBlogPermission, function (req, res) {
    Blog.findById(req.params.id, function (err, blog) {
        res.render("blogEdit", { editBlog: blog });
    })
})

router.delete("/blogs/:id", middleware.hasBlogPermission,function (req, res) {
    Blog.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            console.log("Error deleting");
        } else {
            res.redirect("/blogs");
        }
    })
})

router.put("/blogs/:id",middleware.hasBlogPermission, function (req, res) {
    var id = req.params.id;
    Blog.findByIdAndUpdate(id, req.body.blog, function (err, data) {
        if (err) {
            console.log("ERROR editing the blog");
        }
        else {
            res.redirect("/blogs/" + id);
        }
    })
})


router.post("/blogs/new",middleware.isLoggedin, function (req, res) {
    var inputBlog = req.body.blog;
    console.log("new blog is "+JSON.stringify(req.user))
    inputBlog.author = {
        id : req.user,
        username : req.user.username
    };
    Blog.create(inputBlog);
    res.redirect("/blogs");
})

module.exports = router;