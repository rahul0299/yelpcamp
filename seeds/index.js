const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const { accessKey } = require('../secret/access-key');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => console.log("Connected to DB"))
    .catch(err => console.log("Error connecting to DB", err));

const getRandom = (array) => array[Math.floor(Math.random() * array.length)];

const getImgUrl = async () => {
    const collection = "DSpWkevZa94";
    const url = `https://api.unsplash.com/photos/random?client_id=${accessKey}&collections=${collection}`;
    const headers = {
        'Accept-Version': 'v1'
    };

    const imgUrl = await fetch(url, { headers })
        .then(res => {
            return res.json()
        })
        .then(data => {
            return data.urls.regular;
        });

    return imgUrl;
}

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 5; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            author: '64dbe923dc52e75855ba6a08',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${getRandom(descriptors)} ${getRandom(places)}`,
            image: await getImgUrl(),
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis est modi, facere sit eius amet provident ab reprehenderit quos nemo optio culpa cum aspernatur suscipit eveniet. Eveniet quod quas similique.",
            price: Math.floor(Math.random() * 20) + 10
        });
        await camp.save(); 
    }
    console.log("camps added")
}

seedDB()
    .then(() => mongoose.connection.close());