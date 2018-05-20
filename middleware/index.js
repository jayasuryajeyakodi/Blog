var Blog = require("../models/Blog");
var Comment = require("../models/Comment");

middlewareObj = {};

middlewareObj.isLoggedin = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Can you please log in fuker");
    res.redirect("/login");
}

middlewareObj.hasBlogPermission = function (req, res, next){
    if(req.isAuthenticated()){
        Blog.findById(req.params.id, function (err, blog) {
            if(blog.author.id.equals(req.user._id)){
                return next();
            }
            req.flash("error","you dont' have permission fuker");
            res.redirect("back");
        })
    }
    else{
        req.flash("error","Can you please log in fuker");
        res.redirect("/login");
    }
} 

middlewareObj.hasCommentPermission = function (req, res, next){
    if(req.isAuthenticated()){
        var commentId = req.params.commentId;
        Comment.findById(commentId, function(err, data){
            if(err || data == null || !data){
                console.log("cannot find blog");
                req.flash("error","blog not found");
                res.redirect("/");
            }
            if(data.user.equals(req.user._id)){
                console.log("user has access for comment");
                return next();
            }
            req.flash("error","you dont' have permission fuker");
            res.redirect("back");
        })
    }else{
        req.flash("error","Can you please log in fuker");
        res.redirect("/login")
    }
}

module.exports = middlewareObj;