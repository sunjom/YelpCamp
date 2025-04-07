const mongoose = require('mongoose');
const CampGround = require('../models/campground')
const city = require('./cities')
const {places, descriptors} = require('./seedHelpers')
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp').then((res)=>{
    console.log("Connected")
}).catch(err => console.log(err));

const place = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await CampGround.deleteMany({});
    for(let i = 0 ; i < 50 ; i++){
        const random = Math.floor(Math.random() * 1000);
        const imageFile = await fetch('https://api.unsplash.com/photos/random?client_id=4x9PMHX6neqymWvk9J27doZnc0HtXrEbx1AP54oB0Jc&query=in-the-woods',{
        }).then(res => res.json());
        const price = Math.floor(Math.random()*20) + 10;
        const camp = new CampGround({
            location:`${city[random].city} ${city[random].state}`,
            title:`${place(descriptors)} ${place(places)}`,
            image: imageFile.urls.raw,
            description:'loremag;onerq9pgna;gjab;asf aofmoWNERFIW    fnocim  w[inro  wbr;JAWNFkl;fansfjabsfjabfweiarjrfna;jkf;jkafsfasd fksladnfga;kljgnajgpaiergnanjt g;ant]',
            price
        });
        await camp.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
});