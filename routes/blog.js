var express     = require("express"),
    router      = express.Router(),
    Blog        = require("../models/blog"),
    User        = require("../models/user"),
    middleware  = require("../middleware");

// INDEX ROUTE
router.get("/", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        } else {
            res.render("./blogs/index", {blogs: blogs});
        }
    });
});

//NEW ROUTE - just shows form
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("./blogs/new");
});

//CREATE ROUTE - actually creates the new blog
router.post("/", middleware.isLoggedIn, function(req, res){
    //create blog
    req.body.blog.body = req.sanitize(req.body.blog.body); //sanitize the body entered by user of the new blog - takes out the scripts
    var title   = req.body.blog.title;
    var image   = req.body.blog.image;
    var body    = req.body.blog.body;
    var author = {
        id: req.user._id,
        username: req.user.username
        };
    var newBlog = {title: title, image: image, body: body, author: author};
    Blog.create(newBlog, function(err, newlyCreated){
        if(err){
            console.log(err);
            req.flash("error", {"error": err.message});
            res.redirect("/");
        } else {
            //then, redirect the index
            res.redirect("/blogs");
        }
    });
});

//READ or SHOW - show a blog
router.get("/:id", function(req, res){
    Blog.findById(req.params.id).populate("comments").exec(function(err, foundBlog){
        if(err){
           console.log(err);
           req.flash("error", {"error": err.message});
           res.redirect("/");
        } else {
           User.find({}, function(err, users){
               if(err){
                   console.log(err);
                   req.flash("error", {"error": err.message});
                   res.redirect("/");
               } else {
                   res.render("./blogs/show", {blog:foundBlog, users:users});
               }
            });
        }
    });
});

//EDIT ROUTE -show form, retrieve info from particular blog post
router.get("/:id/edit", middleware.checkBlogOwnership, function (req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log(err);
            req.flash("error", {"error": err.message});
            res.redirect("/");
        } else {
            res.render("./blogs/edit", {blog:foundBlog});
        }
    });
});

//UPDATE ROUTE - update blog post to reflect the changes made to the blog post
router.put("/:id", middleware.checkBlogOwnership, function(req, res){
     req.body.blog.body = req.sanitize(req.body.blog.body);
     Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            console.log(err);
            req.flash("error", "Blog not found");
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
   });
});

//DESTROY BLOG
router.delete("/:id", middleware.checkBlogOwnership, function(req, res){
   Blog.findByIdAndRemove(req.params.id, function(err){
      if(err){
          console.log(err);
          req.flash("error", "Blog not found");
          res.redirect("/blogs");
      } else {
          req.flash("success", "Blog was deleted");
          res.redirect("/blogs");
      }
   });
});

module.exports = router;