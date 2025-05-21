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
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const MongoDBStore = require('connect-mongo');

const ExpressError =require('./utils/ExpressError');
const campgroundRouter = require('./routes/campgrounds')
const reviewRouter = require('./routes/review')
const userRouter = require('./routes/users');
const User = require('./models/user');

const dbUrl =process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp-camp'

mongoose.connect(dbUrl).then((res)=>{
    console.log("Connected")
}).catch(err => console.log(err));

app.engine('ejs',ejsMate)
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
//form 데이터를 res.body에 담아오기 위해 필요
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))

const secret = process.env.SECRET || 'thisshouldbeabettersecret!'

const sessionConfig = {
    store:MongoDBStore.create({
        mongoUrl:dbUrl,
        touchAfter: 24* 60 * 60
    }),
    secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge:1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(helmet());
passport.use(new LocalStrategy(User.authenticate()))
app.use(mongoSanitize({
    replaceWith:'_'
}))

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    
    const ext = req.path.split('.').pop();
    const exclude = ['css','js']
    if (!exclude.includes(ext)) {
        res.locals.urlPath = req.path;
    }
    next();
})

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://firebasestorage.googleapis.com/v0/b/yelpcamp-93f7a.firebasestorage.app/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use('/',userRouter);
app.use('/campgrounds',campgroundRouter);
app.use('/campgrounds/:id/reviews',reviewRouter)
app.use(express.static('public'))
app.get('/',(req,res,next)=>{
    res.render('home')
})

app.all('*',(req,res,next) => {
    next(new ExpressError('Page Not Found',404));
})

app.use((err,req,res,next) => {
    const {status=500} = err;
    if(!err.message) err.message = 'Oh No, Something Went Wrong'
    res.status(status).render('error',{err})
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(port);
    console.log(process.env.DB_URL)
})