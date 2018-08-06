var express     = require("express"),
    router      = express.Router(),
    User        = require("../models/user"),
    Blog        = require("../models/blog"),
    middleware  = require("../middleware");

//SHOW - show profile for logged in user (private)
router.get("/:id/private", middleware.isLoggedIn, function(req, res){
    if(req.user._id.equals(req.params.id)){
       User.findById(req.params.id, function(err, foundUser){
           if(err){
               console.log(err);
               res.redirect("/");
           } else {
               res.render("./users/showprivate", {user:foundUser});
           }
       });
    } else { 
            req.flash("error", "No permission to access page");
            res.redirect("/blogs");
        }
});

//SHOW - show profile of user (public)
router.get("/:id", function(req, res){
       User.findById(req.params.id, function(err, foundUser){
           if(err){
               console.log(err);
               res.redirect("/");
           } else {
               res.render("./users/show", {user:foundUser});
           }
       });
});

//show one user's posts
router.get("/:id/blogs", function(req, res){
       User.findById(req.params.id, function(err, foundUser){
            if(err){
               console.log(err); //user not found
               res.redirect("/");
            } else {
                Blog.find({ "author.id": req.params.id }, function(err, blogs){
                if(err){
                    console.log(err);
                } else {
                    res.render("./users/blogs", {user:foundUser, blogs: blogs});
                }
            });
        }
    });
});

module.exports = router;