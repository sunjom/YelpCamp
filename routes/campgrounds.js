const express = require('express');
const router = express.Router()
const CampGround = require('../models/campground');
const catchAsync = require('../utils/catchAsync')
const ExpressError =require('../utils/ExpressError');
const { campgroundSchema} = require('../schemas');
const {isLoggedIn} = require('../middleware');
const validateCampground = (req,res,next) => {
    const {error} = campgroundSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg,400); 
    }else{
        next()
    }
}

router.get('/', async(req,res) => {
    const campgrounds = await CampGround.find({});
    res.render('campgrounds/index',{campgrounds})
})

router.get('/new',isLoggedIn, async(req,res)=>{
    res.render('campgrounds/make')
})

router.get('/:id',catchAsync(async(req,res) =>{
    const campground = await CampGround.findById(req.params.id).populate('reviews');
    if(!campground){
        req.flash('error','can not find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show',{campground})
}))

router.get('/:id/update',isLoggedIn,catchAsync(async(req,res) =>{
    const campground = await CampGround.findById(req.params.id);
    if(!campground){
        req.flash('error','can not find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/update',{campground})
}))

router.delete('/:id',isLoggedIn,catchAsync(async(req,res,next)=>{
    await CampGround.findByIdAndDelete(req.params.id)
    req.flash('success','successfuly delete campground')
    res.redirect('/campgrounds');
}))

router.post('/',isLoggedIn, validateCampground,catchAsync(async(req,res,next) =>{
    //if(!req.body.campground) throw new ExpressError('Invalid Campground Data',400);
    const data = req.body.campground
    const campground = new CampGround(data)
    await campground.save()
    req.flash('success','Successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}))
router.put('/:id',validateCampground, catchAsync(async(req,res) =>{
    const data = await CampGround.findByIdAndUpdate(req.params.id,req.body.campground);
    req.flash('success','Successfully updated campground!')
    res.redirect(`/campgrounds/${req.params.id}`)
}))

module.exports = router