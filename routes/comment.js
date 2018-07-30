var express     = require("express"),
    router      = express.Router({mergeParams:true}),
    Blog        = require("../models/blog"),
    Comment     = require("../models/comment"),
    middleware  = require("../middleware");

//Comments Create
router.post("/", middleware.isLoggedIn, function(req, res){ //isLoggedIn here will prevent anyone from adding a comment from e.g. Postman unless they are logged in.
   //look up blog using ID
   Blog.findById(req.params.id, function(err, blog){
       if(err){
           console.log(err);
           req.flash("error", "Blog not found");
           res.redirect("/blogs");
        } else {
            req.body.comment.text   = req.sanitize(req.body.comment.text);
            var text                = req.body.comment.text;
            var author              = {
                                        id: req.user._id,
                                        username: req.user.username
                                        };
            var newComment          = {text: text, author: author};
           //create new comment
           Comment.create(newComment, function(err, comment){
               if(err){
                   console.log(err);
                   req.flash("error", "Comment could not be added");
                   res.redirect("back");
               } else {
                    //add username and id to comment
                    // comment.author.id       = req.body.user._id;
                    // comment.author.username = req.body.user.username;
                    //save comment
                    comment.save();
                    //push comment into campground and connect new comment to campground (and save)
                    blog.comments.push(comment);
                    blog.save();
                    //redirect to campground show page
                    req.flash("success", "Comment added");
                    res.redirect("/blogs/" + blog._id);
               }
           });
        }
   });
});

module.exports = router;