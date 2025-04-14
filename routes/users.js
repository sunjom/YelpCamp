const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user')
const passport = require('passport')
const passportLocal = require('passport-local')
const {storeReturnTo} = require('../middleware');
router.get('/register',(req,res)=>{
    res.render('users/register')
})

router.post('/register',catchAsync(async(req,res,next)=>{
    try{
        const {username,email,password} = req.body;
        const user = await User.register(new User({username,email}),password);
        req.login(user, err=>{
            if(err) return next(err);
            req.flash("success","Welcome to Yelp Camp");
            res.redirect('/campgrounds');
        })
    }catch(e){
        req.flash('error',e.message);
        res.redirect('register');
    }
}))

router.get('/login',(req,res)=>{
    res.render('users/login');
})

router.post('/login',storeReturnTo,passport.authenticate('local',{failureFlash:true, failureRedirect:"/login"}),(req,res)=>{
    req.flash('success','welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds'
    res.redirect(redirectUrl);
})

router.get('/logout',(req,res)=>{
    req.logout(
        function(err){
            if(err){
                return next(err);
            }
            req.flash('success',"Goodbye");
            res.redirect('/campgrounds');     
    });
})

module.exports = router