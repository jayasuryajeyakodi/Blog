
var express = require('express');
var router = express.Router();
var Comment = require('../models/Comment'),
    Blog = require('../models/Blog'),
    User = require("../models/User"),
    passport = require("passport");

router.get("/register", function (req, res) {
    res.render("SignUp");
})

router.post("/register", function (req, res) {
    var newUser = req.body.user;
    console.log("User signup:" + newUser)
    User.register(new User({
        username: newUser.username
    }), newUser.password, function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            passport.authenticate('local', function (err, data) {
                if (err) {
                    console.log("starting authentication")

                    console.log(err);
                } else {

                    res.redirect("/blogs");
                }
            })
            console.log("auth done on signup")
        }

    });


})

module.exports = router;