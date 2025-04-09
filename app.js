const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const CampGround = require('./models/campground');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate')
const catchAsync = require('./utils/catchAsync')
const ExpressError =require('./utils/ExpressError');
const Joi = require('joi');
const { campgroundSchema } = require('./schemas');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp').then((res)=>{
    console.log("Connected")
}).catch(err => console.log(err));

app.engine('ejs',ejsMate)
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
//form 데이터를 res.body에 담아오기 위해 필요
app.use(express.urlencoded({extends:true}))
app.use(methodOverride('_method'))

const validateCampground = (req,res,next) => {
    const {error} = campgroundSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg,400); 
    }else{
        next()
    }
}

app.get('/',(req,res)=>{ 
    res.render('home');
})
app.get('/campgrounds', async(req,res) => {
    const campgrounds = await CampGround.find({});
    res.render('campgrounds/index',{campgrounds})
})

app.get('/campgrounds/new',async (req,res)=>{
    res.render('campgrounds/make')
})

app.get('/campgrounds/:id',catchAsync(async(req,res) =>{
    const campground = await CampGround.findById(req.params.id);
    res.render('campgrounds/show',{campground})
}))

app.get('/campgrounds/:id/update',catchAsync(async(req,res) =>{
    const campground = await CampGround.findById(req.params.id);
    res.render('campgrounds/update',{campground})
}))

app.delete('/campgrounds/:id', catchAsync(async(req,res,next)=>{
    await CampGround.findByIdAndDelete(req.params.id)
    res.redirect('/campgrounds');
}))

app.post('/campgrounds',validateCampground,catchAsync(async(req,res,next) =>{
    //if(!req.body.campground) throw new ExpressError('Invalid Campground Data',400);
    const data = req.body.campground
    const campground = new CampGround(data)
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.put('/campgrounds/:id',validateCampground, catchAsync(async(req,res) =>{
    const data = await CampGround.findByIdAndUpdate(req.params.id,req.body.campground);
    res.redirect(`/campgrounds/${req.params.id}`)
}))

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