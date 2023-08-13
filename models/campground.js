const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const campgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Review'
        }
    ]
});

campgroundSchema.pre('findOneAndDelte', async function(doc) {
    if (doc) {
        await Review.remove({
            _id: { $in: doc.reviews }
        });
    }
});


const Campground = mongoose.model('Campground', campgroundSchema);

module.exports = Campground;