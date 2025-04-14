const express = require('express');
const router = express.Router()
const campground = require('../controllers/campgrounds')
const catchAsync = require('../utils/catchAsync')
const {isLoggedIn,validateCampground,isAuthor} = require('../middleware');


router.get('/', catchAsync(campground.index))

router.get('/new',isLoggedIn, campground.renderNewForm)

router.get('/:id',catchAsync(campground.renderShowForm))

router.get('/:id/update',isLoggedIn,isAuthor,catchAsync(campground.renderUpdateForm))

router.delete('/:id',isLoggedIn,isAuthor,catchAsync(campground.deleteForm))

router.post('/',isLoggedIn, validateCampground,catchAsync(campground.makeForm))
router.put('/:id',validateCampground,isAuthor, catchAsync(campground.updateForm))

module.exports = router