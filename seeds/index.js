const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => console.log("Connected to DB"))
    .catch(err => console.log("Error connecting to DB", err));

const getRandom = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${getRandom(descriptors)} ${getRandom(places)}`
        });
        await camp.save(); 
    }
    console.log("camps added")
}

seedDB()
    .then(() => mongoose.connection.close());