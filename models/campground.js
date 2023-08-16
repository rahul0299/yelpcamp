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
    ],
    author: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    }
});

campgroundSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await Review.deleteMany({
            id: { $in: doc.reviews }
        });
    }
});


const Campground = mongoose.model('Campground', campgroundSchema);

module.exports = Campground;