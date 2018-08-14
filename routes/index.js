var express     = require("express"),
    passport    = require("passport"),
    User        = require("../models/user"),
    router      = express.Router();

router.get("/", function(req, res){
   res.render("landing");
});

//register form route
router.get("/register", function(req, res){
   res.render("register"); 
});

//handle signup logic
router.post("/register", function(req, res){
   var newUser = new User   ({  username: req.body.username,
                                email: req.body.email,
                                image: req.body.image
                            });
   User.register(newUser, req.body.password, function(err, user){
      if(err){
           return res.render("register", {"error": err.message});
      } else {
          passport.authenticate("local")(req, res, function(){
              req.flash("success", "Welcome " + user.username + ", your account was successfully registered!");
              res.redirect("/blogs");
          });
      }
   });
});

//show login form
router.get("/login", function(req, res){
    res.render("login");
});

//handling login logic
router.post("/login", passport.authenticate("local", {
        successRedirect: "/blogs",
        failureRedirect: "/login",
        failureFlash: true
    }), function(req, res){
});

//LOGOUT ROUTE
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You were logged out!");
    res.redirect("/blogs");
});

//TEST to send JSON to FrontEnd
// router.get("/test", function(req, res) {
//     User.find(function(err, users) {
//         if(err){
//             console.log(err);
//         } else {
//             res.json(users);
//         }
//     });
// });

module.exports = router;