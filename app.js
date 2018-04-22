var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'); 

    // HTML forms doesnt support PUT, so as a workaround
    // we use a module called method override, which intercepts the request and changes to a 
    // put/* method by looking at the param we inject in the constructor

mongoose.connect("mongodb://localhost:27017/blog");
app.set("view engine", "ejs");
// exposing static assets via middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// Please remember to set default values to the elements are do some validation, else the field 
// is empty in the DB.
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    createdDate: {
        type: Date,
        default: Date.now
    }
});

var Blog = mongoose.model("Blog", blogSchema);
// Blog.create({
//     title: "wow",
//     image: "https://images.pexels.com/photos/955244/pexels-photo-955244.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
//     body: "mountain view wow"
// });

// Please follow RESTful guidelines
// Routers
// Please sanitise the input before proceeding into logic, there
// are modules that does that express-sanitize
app.get("/", function (req, res) {
    res.redirect("/blogs");
})

app.get("/blogs", function (req, res) {
    Blog.find({}, function (err, blog) {
        res.render("index", { blogs: blog });
    })
});

// purposely placing this route above the id one cuase that will get hit first
app.get("/blogs/new", function(req, res){
    res.render("newBlogForm");
})

app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, blog) {
        if(err){
            res.redirect("/");
        }
        else{
            res.render("showSelectedBlog", {foundBlog:blog});
        }
    })
});

app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, blog){
        res.render("blogEdit", {editBlog:blog});
    })
})

app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log("Error deleting");
        }else{
            res.redirect("/blogs");
        }
    })
})

app.put("/blogs/:id", function(req, res){
    var id = req.params.id;
    Blog.findByIdAndUpdate(id, req.body.blog, function(err, data){
        if(err){
            console.log("ERROR editing the blog");
        }
        else{
            res.redirect("/blogs/"+id);
        }
    })
})
app.post("/blogs/new",function(req, res){
    var inputBlog = req.body.blog;
    Blog.create(inputBlog);
    res.redirect("/blogs");
})

//Listen on the port and start the server
app.listen(7777, function (err) {
    console.log("Server is listening damn!");
    console.log("error if any" + err);
})