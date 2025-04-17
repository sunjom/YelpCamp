const Files = require('../firebase/uploadFunc');
const CampGround = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken:mapBoxToken});


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
    const geoData = await geocoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send()

    const urls = await Files.uploadFiles(req.files);
    const campground = new CampGround(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry
    campground.images = urls
    campground.author = req.user._id;
    console.log(campground)
    await campground.save()
    req.flash('success','Successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.updateForm = async(req,res) =>{
    const {campground,deleteImages} = req.body
    console.log(deleteImages);
    const data = await CampGround.findByIdAndUpdate(req.params.id,campground);
    if(req.files.length > 0){
        const urls = await Files.uploadFiles(req.files)
        data.images.push(...urls)
    }
    if(deleteImages){
        await Files.deleteFile(deleteImages);
        data.images = data.images.filter(img => !deleteImages.includes(img.fileName))
    }
    await data.save();
    req.flash('success','Successfully updated campground!')
    res.redirect(`/campgrounds/${req.params.id}`)
}