var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    mongoose = require('mongoose'),
    Comment = require('./models/Comment'),
    Blog = require('./models/Blog');

// Routes
var mainRoute = require('./Routes/main'),
    blogRoute = require('./Routes/blog'),
    commentRoute = require('./Routes/comment');

// HTML forms doesnt support PUT, so as a workaround
// we use a module called method override, which intercepts the request and changes to a 
// put/* method by looking at the param we inject in the constructor
// TODO: learn data assocations and passport.js in depth


mongoose.connect("mongodb://localhost:27017/blog");

app.set("view engine", "ejs");
// exposing static assets via middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Please follow RESTful guidelines
// Routers
// Please sanitise the input before proceeding into logic, there
// are modules that does that express-sanitize

app.use(mainRoute);
app.use(blogRoute);
app.use(commentRoute);

//Listen on the port and start the server
app.listen(7777, function (err) {
    console.log("Server is listening damn!");
    console.log("error if any" + err);
})