var express=require('express');
var router=express.Router();
var User=require('../models/user');
var passport=require('passport');

router.get("/", function(req, res){
    res.render("campground/landing");
});
//Auth Route
router.get('/register',(req,res)=>{
    res.render('register');

});
router.post('/register',(req,res)=>{
var newUser=new User({username:req.body.username});
User.register(newUser,req.body.password,function(err,user){
    if(err){
        req.flash("error",err.message);
        return res.render('register');
    }
    passport.authenticate('local')(req,res,function(){
        req.flash("success","Welcome TO YelpCamp "+user.username);
        res.redirect('/campgrounds');
    });
});
});

//login routes
router.get('/login',(req,res)=>{
    res.render('login');
});

router.post('/login',passport.authenticate('local',{
        successRedirect:'/campgrounds',
        failureRedirect:'/login'
}),(req,res)=>{
});

router.get('/logout',(req,res)=>{
    req.logOut();
    req.flash("success","Logged Out Successfully.");
    res.redirect('/campgrounds');
});


module.exports=router;