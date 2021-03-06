
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    mongoose = require('mongoose'),
    User = require('./models/User'),
    Comment = require('./models/Comment'),
    Blog = require('./models/Blog'),
    passport = require('passport'),
    localStrategy = require('passport-local'),
    flash = require("connect-flash"),
    Note = require("./models/Note");



// Routes
var mainRoute = require('./Routes/main'),
    blogRoute = require('./Routes/blog'),
    commentRoute = require('./Routes/comment'),
    authRoute = require('./Routes/auth'),
    noteRoute = require('./Routes/note');

// HTML forms doesnt support PUT, so as a workaround
// we use a module called method override, which intercepts the request and changes to a 
// put/* method by looking at the param we inject in the constructor
// TODO: learn data assocations and passport.js in depth


mongoose.connect("mongodb://jayasurya.documents.azure.com:10255/blog?ssl=true",{
    auth:{
        user:"jayasurya",
        password:"AQ9JHPwV8Hp6UJanhsX3rTns8J6J7DVPIBO31nopSb6W42VhO8JHBLlWYnG5kXU00dEb6COXkBLSjMzYYucy1g=="
    }
}, function(err, db){
    if(err){
        console.log("cannot connect to mongo db"+err)
    }
});

app.set("view engine", "ejs");
// exposing static assets via middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(flash());

//passport ocnfiguration
app.use(require('express-session')({
    secret: "jayasurya",
    resave: false, // no idea what this means, need to lookup
    saveUninitialized: false // same here
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Please follow RESTful guidelines
// Routers
// Please sanitise the input before proceeding into logic, there
// are modules that does that express-sanitize

// to pass data to all the templates, use this method
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(mainRoute);
app.use(blogRoute);
app.use(commentRoute);
app.use(noteRoute);
//app.use(authRoute);

app.get("/register", function (req, res) {
    res.render("SignUp");
})

app.post("/register", function (req, res) {
    console.log(req.body);
    User.register(new User({
        username: req.body.username
    }), req.body.password, function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            passport.authenticate('local', function (err, data) {
                if (err) {
                    console.log(err);
                } else {

                    res.redirect("/blogs");
                }
            })
            res.redirect("/login");
        }


    })
})

app.get("/login", function (req, res) {

    res.render("login");
})


app.post("/login", passport.authenticate("local", {
    successRedirect: "/blogs",
    failureRedirect: "/blogs/new"
}), function (req, res) {
});

app.get("/logout", function (req, res) {
    req.logout();
    req.flash("success","logged out successfully");
    res.redirect("/blogs");
})

function isLoggedin(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }

    res.redirect("/");
}

//Listen on the port and start the server
app.listen(process.env.PORT || 7777, function (err) {
    console.log("Server is listening damn!");
    console.log("error if any" + err);
})