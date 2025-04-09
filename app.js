const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate')
const ExpressError =require('./utils/ExpressError');
const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/review')
const flash = require('connect-flash')

const session = require('express-session')
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp').then((res)=>{
    console.log("Connected")
}).catch(err => console.log(err));

app.engine('ejs',ejsMate)
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
//form 데이터를 res.body에 담아오기 위해 필요
app.use(express.urlencoded({extends:true}))
app.use(methodOverride('_method'))
app.use(flash());

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

app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/campgrounds',campgrounds);
app.use('/campgrounds/:id/reviews',reviews)
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