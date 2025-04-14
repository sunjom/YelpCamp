const CampGround = require('../models/campground');
module.exports.index = async(req,res) => {
    const campgrounds = await CampGround.find({});
    res.render('campgrounds/index',{campgrounds})
}

module.exports.renderNewForm = async(req,res)=>{
    res.render('campgrounds/make')
}

module.exports.renderShowForm = async(req,res) =>{
    const campground = await CampGround.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author');
    
    if(!campground){
        req.flash('error','can not find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show',{campground})
}

module.exports.renderUpdateForm = async(req,res) =>{
    const {id} = req.params;
    const campground = await CampGround.findById(id);
    if(!campground){
        req.flash('error','can not find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/update',{campground})
}

module.exports.deleteForm = async(req,res,next)=>{
    await CampGround.findByIdAndDelete(req.params.id)
    req.flash('success','successfuly delete campground')
    res.redirect('/campgrounds');
}

module.exports.makeForm =async(req,res,next) =>{
    //if(!req.body.campground) throw new ExpressError('Invalid Campground Data',400);
    const data = req.body.campground;
    const campground = new CampGround(data);
    campground.author = req.user._id;
    await campground.save()
    req.flash('success','Successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.updateForm = async(req,res) =>{
    const data = await CampGround.findByIdAndUpdate(req.params.id,req.body.campground);
    req.flash('success','Successfully updated campground!')
    res.redirect(`/campgrounds/${req.params.id}`)
}