var express     = require("express"),
    router      = express.Router(),
    User        = require("../models/user"),
    Blog        = require("../models/blog"),
    middleware  = require("../middleware");

//SHOW - show profile of user
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
                    res.render("./users/blogs", {user: foundUser, blogs: blogs});
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
                User.findById(req.user._id, function(err, loggedInUser){
                    if(err){
                        console.log(err);
                        res.redirect("/");
                    } else {
                        //make sure a user cannot follow self
                        if(req.user._id.equals(req.params.id)){
                            req.flash("error", "Cannot follow yourself");
                            res.redirect("back");
                        } else {
                                //check if loggedInUser is already following foundUser
                                if(foundUser.followers.indexOf(loggedInUser._id) == -1){
                                    //add follower to foundUser
                                    foundUser.followers.push(loggedInUser._id);
                                    foundUser.save();
                                    //add foundUser to following of loggedInUser
                                    loggedInUser.following.push(foundUser._id);
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

//show followers
router.get("/:id/followers", function(req, res){
       User.findById(req.params.id, function(err, foundUser){
            if(err){
               console.log(err); //user not found
               res.redirect("/");
            } else {
               //build array of users that are in followers list
               User.find({
                   '_id': {
                       $in: foundUser.followers
                   }
               }, function(err, followers) {
                   if(err){
                       console.log(err);
                   } else {
                       res.render("./users/followers", {user: foundUser, followers: followers});
                   }
               });
            }
        });
});


module.exports = router;