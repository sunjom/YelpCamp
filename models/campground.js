const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')

const opts = {toJSON:{virtuals:true}}
const CampGroundSchema = new Schema({
    title:String,
    images:[
        {
            url:String,
            fileName:String,
        }
    ],
    geometry:{
        type:{
            type:String,
            enum:['Point'],
        },
        coordinates:{
            type:[Number],
        }
    },
    price:Number,
    description:String,
    location:String,
    unit:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ],
},opts);

CampGroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `
        <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
        <p>${this.description.substring(0,20)}...</p>
        `
})

CampGroundSchema.post('findOneAndDelete',async function(doc){
    if(doc){
        await Review.deleteMany({
            _id:{$in:doc.reviews}
        })
    }
    
})

module.exports = mongoose.model('Campground',CampGroundSchema);