const mongoose = require('mongoose');
const Campground = require('../models/campground');
const User = require('../models/user');
const Review = require('../models/review');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const { accessKey } = require('../secret/access-key');
const { usernames } = require('./users');
const { images } = require('./images');
const user = require('../models/user');
const { reviews } = require('./reviews');

mongoose.connect(process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp-camp')
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
    // clean the DB
    await User.deleteMany({});
    await Campground.deleteMany({});
    await Review.deleteMany({});
    

    // add new users
    const users = [];
    const campgrounds = [];

    for (let i=0;i<usernames.length;i++) {
        const username = usernames[i];
        const email = `${username}@gmail.com`;
        const password = username;

        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        users.push(registeredUser);
    }
    console.log("new users created");

    // add new camps
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            author: getRandom(users)._id,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${getRandom(descriptors)} ${getRandom(places)}`,
            geometry: {
                type:"Point", 
                coordinates:[
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis est modi, facere sit eius amet provident ab reprehenderit quos nemo optio culpa cum aspernatur suscipit eveniet. Eveniet quod quas similique.",
            price: Math.floor(Math.random() * 20) + 10,
            images: [
                getRandom(images),
                getRandom(images)
            ]
        });
        await camp.save();
        campgrounds.push(camp);
    }
    console.log("new camps created");

    // add new reviews
    for (let i=0;i<200;i++) {
        let author = getRandom(users);
        let campground = await Campground.findById(getRandom(campgrounds)._id);
        const reviewBody = getRandom(reviews);

        while (campground.author == author) {
            author = getRandom(users);
        }

        const review = new Review({
            author: author._id,
            body: reviewBody,
            rating: Math.floor(Math.random() * 10) % 3 + 3
        })

        const newReview = await review.save();
    
        campground.reviews.push(newReview._id);
        await campground.save();
    }
    console.log("reviews added")
}

seedDB()
    .then(() => mongoose.connection.close());