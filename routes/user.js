var express     = require("express"),
    router      = express.Router(),
    User        = require("../models/user"),
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

module.exports = router;