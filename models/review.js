const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    body: {
        type: String
    },
    rating: {
        type: Number
    },
    author: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Review', reviewSchema);