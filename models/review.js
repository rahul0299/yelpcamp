const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    body: {
        type: String
    },
    rating: {
        type: Number
    }
});

module.exports = mongoose.model('Review', reviewSchema);