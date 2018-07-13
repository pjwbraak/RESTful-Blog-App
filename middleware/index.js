var Blog        = require("../models/blog"),
    middleware  = require("../middleware");

//all the middleware goes here
var middlewareObj = {};

middlewareObj.checkBlogOwnership = function(req, res, next){
    //Middleware to check if blog is owned by user
    //is user logged in?
        if(req.isAuthenticated()){
            Blog.findById(req.params.id, function(err, foundBlog){
                if(err){
                    req.flash("error", "Blog not found");
                    res.redirect("back");
                } else {
                    //does user own the blog?
                    // if(foundBlog.author.id === req.user._id) //wont work because the two are not the same type. The first is a mongoDB object that only looks like a string! So we need to use a method that mongoose gives us for this purpose.
                    if(foundBlog.author.id.equals(req.user._id)){
                        next();
                    } else { 
                        //if not: redirect
                        req.flash("error", "You do not have permission to do that");
                        res.redirect("back"); //will take user back to previous page
                    }
                }
            });
    //if not logged in, redirect
        } else {
            req.flash("error", "You need to be logged in to do that");
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
//                         req.flash("error", "You do not have permission to do that");
//                         res.redirect("back"); //will take user back to previous page
//                     }
//                 }
//             });
//     //if not logged in, redirect
//         } else {
//             req.flash("error", "You need to be logged in to do that");
//             res.redirect("back");
//         }
// };

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that"); //the way flash works is that is shows up on the NEXT page, so you do it before you redirect. This line only gives us the capability to access it on the next request.
    res.redirect("/login");
};

module.exports = middlewareObj;