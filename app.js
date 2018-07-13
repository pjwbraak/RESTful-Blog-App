var express                 = require("express"),
    app                     = express(),
    bodyParser              = require("body-parser"),
    mongoose                = require("mongoose"),
    methodOverride          = require("method-override"),
    expressSanitizer        = require("express-sanitizer"),
    
    User                    = require("./models/user"),
    Blog                    = require("./models/blog"),
    passport                = require("passport"),
    LocalStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose"),
    flash                   = require("connect-flash"),
    
    indexRoutes             = require("./routes/index"),
    blogRoutes              = require("./routes/blog");
    
//set up a database
//APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

app.use(flash());

//PASSPORT CONFIGURATION
app.use(require("express-session")({    
    
    secret: "First Second Third", 
    resave: false,
    saveUninitialized: false,
    
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware to pass in currentUser to header on all templates
app.use(function(req, res, next){ //app.use means it will be used for every route in the app
    res.locals.currentUser = req.user; //whatever we put in res.locals is whats available inside our template
    res.locals.error = req.flash("error"); //so we can use error (flash) on each template (header)
    res.locals.success = req.flash("success");
    next(); //needed to move on to next middleware
});

app.use("/", indexRoutes);
app.use("/blogs", blogRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running");
});
