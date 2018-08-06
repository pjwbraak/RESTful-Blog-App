var express     = require("express"),
    router      = express.Router({mergeParams:true}),
    Blog        = require("../models/blog"),
    Comment     = require("../models/comment"),
    middleware  = require("../middleware");

//Comments Create
router.post("/", middleware.isLoggedIn, function(req, res){
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
                    //save comment
                    comment.save();
                    //push comment into blog and connect new comment to blog (and save)
                    blog.comments.push(comment);
                    blog.save();
                    //redirect to blog show page
                    req.flash("success", "Comment added");
                    res.redirect("/blogs/" + blog._id);
               }
           });
        }
   });
});

module.exports = router;