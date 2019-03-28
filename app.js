var express      = require("express"),
    app          = express(),
    bodyParser   = require("body-parser"),
    mongoose     = require("mongoose"),
    Campground   = require("./models/campground"),
    flash        = require("connect-flash"),
    Comment      =require('./models/comment'),
    methodOverride=require('method-override');
    passport     =require('passport'),
    LocalStrategy=require('passport-local'),
    User         =require("./models/user.js");

const db="mongodb+srv://Sanjeevsky:Sanjeev@96@cluster0-gu4w6.mongodb.net/test?retryWrites=true";
//Importing Routers
var commentRoutes=require('./routes/comments'),
    campgroundRoutes=require('./routes/campgrounds'),
    indexRoutes=require('./routes/index');    

mongoose.connect(db,{useNewUrlParser:true})
.then(()=>{
    console.log("Database Connected....");
})
.catch((err)=>{
    console.log("Failed To Connect Database");
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());

//passport configuration
app.use(require("express-session")({
    secret:"Welcome TO beautiful world",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash('error');
    res.locals.success=req.flash('success');
    next();
});
//Setting Up Routers
app.use("/",indexRoutes);
app.use('/campgrounds/:id/comments',commentRoutes);
app.use('/campgrounds',campgroundRoutes);

const port=process.env.PORT || 5000;
app.listen(port,()=>{
     console.log(`Server Created Successfully on ${port}`);    
});