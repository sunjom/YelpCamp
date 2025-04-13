const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')
const CampGroundSchema = new Schema({
    title:String,
    image:String,
    price:Number,
    description:String,
    location:String,
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