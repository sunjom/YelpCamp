const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const user = require('../controllers/user')
const passport = require('passport')
const {storeReturnTo} = require('../middleware');

router.route('/register')
    .get(user.renderRegisterForm)
    .post(catchAsync(user.sendRegister))

router.route('/login')
    .get(user.renderLoginForm)
    .post(storeReturnTo,
        passport.authenticate('local',{failureFlash:true, failureRedirect:"/login"}),
        user.sendLogin)

router.get('/logout',user.renderLogout)

module.exports = router