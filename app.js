if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate')
const flash = require('connect-flash')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session')

const ExpressError =require('./utils/ExpressError');
const campgroundRouter = require('./routes/campgrounds')
const reviewRouter = require('./routes/review')
const userRouter = require('./routes/users');
const User = require('./models/user');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp').then((res)=>{
    console.log("Connected")
}).catch(err => console.log(err));

app.engine('ejs',ejsMate)
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
//form 데이터를 res.body에 담아오기 위해 필요
app.use(express.urlencoded({extends:true}))
app.use(methodOverride('_method'))

const sessionConfig = {
    secret:'thisshouldbeabettersecret!',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expirse:Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge:1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/',userRouter);
app.use('/campgrounds',campgroundRouter);
app.use('/campgrounds/:id/reviews',reviewRouter)
app.use(express.static('public'))


app.all('*',(req,res,next) => {
    next(new ExpressError('Page Not Found',404));
})

app.use((err,req,res,next) => {
    const {status=500} = err;
    if(!err.message) err.message = 'Oh No, Something Went Wrong'
    res.status(status).render('error',{err})
})


app.listen(3000, () => {
    console.log('Serving on port 3000')
})