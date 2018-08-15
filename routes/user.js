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
           Blog.find({ "author.id": req.params.id }, function(err, blogs){
               if(err){
                   console.log(err);
               } else {
                   res.render("./users/show", {user:foundUser, blogs: blogs});
               }
            });
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

//add follower
router.post("/:id/followers", middleware.isLoggedIn, function(req, res){
    User.findById(req.params.id, function(err, foundUser){
            if(err){
               console.log(err);
               res.redirect("/");
            } else {
                User.findById(req.user.id, function(err, loggedInUser){
                    if(err){
                        console.log(err);
                        res.redirect("/");
                    } else {
                        //make sure a user cannot follow oneself
                        if(req.user._id.equals(req.params.id)){
                            req.flash("error", "Cannot follow yourself");
                            res.redirect("back");
                        } else {
                                //check if loggedInUser is already following foundUser
                                if(foundUser.followers.indexOf(loggedInUser.id) == -1){
                                    //add follower to foundUser
                                    foundUser.followers.push(loggedInUser.id);
                                    foundUser.save();
                                    //add foundUser to following of loggedInUser
                                    loggedInUser.following.push(foundUser.id);
                                    loggedInUser.save();
                                    //redirect back to foundUser page
                                    req.flash("success", "User added to your following list");
                                    res.redirect("back");
                                } else {
                                    req.flash("error", "You are already following this user");
                                    res.redirect("back");
                                }
                        }
                    }
                });
            }
    });
});

module.exports = router;