var express    = require("express"),
    app        = express(),
    mongoose   = require("mongoose"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override");

//App Config
mongoose.connect("mongodb://localhost/blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

// Mongoose Model config
var blogSchema = mongoose.Schema({
   title: String,
   image: String,
   body: String,
   created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

//RESTFUL Routes
app.get("/", function(req, res){
    res.redirect("/blogs");
});

//Index Route
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, Blogs){
        if(err){
            console.log(err);
       } else{
            res.render("index", {blogs: Blogs});       
       }
    });
    
});

//New Route
app.get("/blogs/new", function(req, res){
    res.render("new");
});

//Create Route
app.post("/blogs", function(req, res){
   var data = req.body.blog;
   Blog.create(data, function(err, newBlog){
       if(err){
           res.render("new");
       } else {
           res.redirect("/blogs");
       }
   }); 
});

// Show Route
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
       if (err){
           res.redirect("/blogs");
       } else {
           res.render("show", {blog: foundBlog});
       }
    });
});

//Edit Route
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
       if (err){
           res.redirect("/blogs");
       } else {
           res.render("edit", {blog: foundBlog});
       }
    });
    
});

//Update Route
app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs" + req.params.id);
        }
    });
});

//Delete Route
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs");
        }
    });
});





app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The server is Running!"); 
});