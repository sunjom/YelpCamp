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
        // const imageFile = await fetch('https://api.unsplash.com/photos/random?client_id=4x9PMHX6neqymWvk9J27doZnc0HtXrEbx1AP54oB0Jc&query=in-the-woods',{
        // }).then(res => res.json());
        const imageFile = 'https://www.syu.ac.kr/wp-content/uploads/2021/11/%ED%98%B8%ED%94%84%EC%BA%A0%ED%94%84-%EC%B2%B4%ED%97%98%EA%B8%B0-6-%EC%9D%B8%EC%84%B1%EA%B5%90%EC%9C%A1%EC%9B%90-%EC%A0%9C%EA%B3%B5-scaled.jpg'
        const price = Math.floor(Math.random()*20) + 10;
        const camp = new CampGround({
            author:'67fb8e7152f34b1424073b0f',
            location:`${city[random].city} ${city[random].state}`,
            title:`${place(descriptors)} ${place(places)}`,
            images: [{
              url: 'https://firebasestorage.googleapis.com/v0/b/yelpcamp-93f7a.firebasestorage.app/o/uploads%2F0eeb68cc-251c-4cc5-8657-08803960b9ea-free-icon-address-6948631.png?alt=media&token=0689db1b-881c-47d9-aa76-e51adaf0aa91',
              fileName: '0eeb68cc-251c-4cc5-8657-08803960b9ea-free-icon-address-6948631.png',
              
            }],
            description:'loremag;onerq9pgna;gjab;asf aofmoWNERFIW    fnocim  w[inro  wbr;JAWNFkl;fansfjabsfjabfweiarjrfna;jkf;jkafsfasd fksladnfga;kljgnajgpaiergnanjt g;ant]',
            price,
            geometry:{
                type: 'Point', 
                coordinates: [ city[random].longitude, city[random].latitude ] 
            }
        });
        await camp.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
});