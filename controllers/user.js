const User = require('../models/user')

module.exports.renderRegisterForm = (req,res)=>{
    res.render('users/register')
}

module.exports.sendRegister = async(req,res,next)=>{
    try{
        const {username,email,password} = req.body;
        const user = await User.register(new User({username,email}),password);
        req.login(user, err=>{
            if(err) return next(err);
            req.flash("success","Welcome to Yelp Camp");
            return res.redirect('/campgrounds');
        })
    }catch(e){
        req.flash('error',e.message);
        res.redirect('register');
    }
}

module.exports.renderLoginForm = (req,res)=>{
    res.render('users/login');
}

module.exports.sendLogin = (req,res)=>{
    req.flash('success','welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds'
    res.redirect(redirectUrl);
}

module.exports.renderLogout = (req,res)=>{
    req.logout(
        function(err){
            if(err){
                return next(err);
            }
            req.flash('success',"Goodbye");
            res.redirect('/campgrounds');     
    });
}