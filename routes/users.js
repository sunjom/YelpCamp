const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const user = require('../controllers/user')
const passport = require('passport')
const {storeReturnTo} = require('../middleware');
router.get('/register',user.renderRegisterForm)

router.post('/register',catchAsync(user.sendRegister))

router.get('/login',user.renderLoginForm)

router.post('/login',
    storeReturnTo,
    passport.authenticate('local',{failureFlash:true, failureRedirect:"/login"}),
    user.sendLogin)

router.get('/logout',user.renderLogout)

module.exports = router