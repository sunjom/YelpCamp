const Review = require('../models/review')
const CampGround = require('../models/campground');

module.exports.makeReview = async(req,res,next) => {
    const campground = await CampGround.findById(req.params.id)
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save()
    req.flash('success','create new Review')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteReview = async(req,res,next)=>{
    const {id,reviewId} = req.params
    await CampGround.findByIdAndUpdate(id,{$pull:{reviews:reviewId} })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success','successfuly delete review')
    res.redirect(`/campgrounds/${id}`)
}