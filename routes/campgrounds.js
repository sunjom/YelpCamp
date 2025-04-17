const express = require('express');
const router = express.Router()
const campground = require('../controllers/campgrounds')
const catchAsync = require('../utils/catchAsync')
const {isLoggedIn,validateCampground,isAuthor} = require('../middleware');
const multer = require('multer');
const upload = multer({storage:multer.memoryStorage()})

router.route('/')
    .get(catchAsync(campground.index))
    .post(isLoggedIn,
        upload.array('image'),
        validateCampground,
        catchAsync(campground.makeForm))

router.get('/new',isLoggedIn, campground.renderNewForm)

router.route('/:id')
    .get(catchAsync(campground.renderShowForm))
    .put(isLoggedIn,isAuthor,upload.array('image'),validateCampground, catchAsync(campground.updateForm))
    .delete(isLoggedIn,isAuthor,catchAsync(campground.deleteForm))

router.get('/:id/update',isLoggedIn,isAuthor,catchAsync(campground.renderUpdateForm))

module.exports = router