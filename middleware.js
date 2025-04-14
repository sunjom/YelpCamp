module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.flash("error","you muse be signed in")
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (req,res,next) => {
    req.session.returnTo = req.originalUrl
    if(req.session.returnTo){
        res.locals.returnto = req.session.returnTo;
    }
    next();
}