const express = require('express');
const router = express.Router({mergeParams:true})
const catchAsync = require('../utils/catchAsync')
const review = require('../controllers/review')
const {validateReview,isLoggedIn,isReviewAuthor} = require('../middleware');

router.post('/',isLoggedIn,validateReview ,catchAsync(review.makeReview))

router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(review.deleteReview))

module.exports = router