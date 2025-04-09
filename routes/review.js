const express = require('express');
const router = express.Router({mergeParams:true})
const {reviewSchema } = require('../schemas');
const Review = require('../models/review')
const CampGround = require('../models/campground');
const catchAsync = require('../utils/catchAsync')

const validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg,400); 
    }else{
        next()
    }
}

router.delete('/:reviewId',catchAsync(async(req,res,next)=>{
    const {id,reviewId} = req.params
    await CampGround.findByIdAndUpdate(id,{$pull:{reviews:reviewId} })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success','successfuly delete review')
    res.redirect(`/campgrounds/${id}`)
}))

router.post('/',validateReview ,catchAsync(async(req,res,next) => {
    const campground = await CampGround.findById(req.params.id)
    const review = new Review(req.body.review)
    campground.reviews.push(review);
    await review.save();
    await campground.save()
    req.flash('success','create new Review')
    res.redirect(`/campgrounds/${campground._id}`)
}))

module.exports = router