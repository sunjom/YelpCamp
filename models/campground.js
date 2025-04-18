const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')

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
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
})

CampGroundSchema.post('findOneAndDelete',async function(doc){
    if(doc){
        await Review.deleteMany({
            _id:{$in:doc.reviews}
        })
    }
    console.log(doc);
})

module.exports = mongoose.model('Campground',CampGroundSchema);