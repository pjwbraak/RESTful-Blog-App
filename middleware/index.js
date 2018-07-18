var Blog        = require("../models/blog"),
    middleware  = require("../middleware");

var middlewareObj       = {};
var needToLoginText     = "Please log in to proceed"
var noPermissionText    = "No permission for action"

middlewareObj.checkBlogOwnership = function(req, res, next){
    
//Middleware to check if blog is owned by user
    if(req.isAuthenticated()){
        Blog.findById(req.params.id, function(err, foundBlog){
            if(err){
                req.flash("error", "Blog not found");
                res.redirect("back");
            } else {
                if(foundBlog.author.id.equals(req.user._id)){
                    next();
                } else { 
                    req.flash("error", noPermissionText);
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", needToLoginText);
        res.redirect("back");
    }
};

// middlewareObj.checkCommentOwnership = function(req, res, next){
//     //is user logged in?
//         if(req.isAuthenticated()){
//             Comment.findById(req.params.comment_id, function(err, foundComment){
//                 if(err){
//                     req.flash("error", "Comment not found");
//                     res.redirect("back");
//                 } else {
//                     //does user own the comment?
//                     if(foundComment.author.id.equals(req.user._id)){
//                         next();
//                     } else { 
//                         //if not: redirect
//                         req.flash("error", noPermissionText);
//                         res.redirect("back"); //will take user back to previous page
//                     }
//                 }
//             });
//     //if not logged in, redirect
//         } else {
//             req.flash("error", needToLoginText);
//             res.redirect("back");
//         }
// };

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", needToLoginText);
    res.redirect("/login");
};

module.exports = middlewareObj;