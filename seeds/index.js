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
            author: '64dd0593890f6cf75f190438',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${getRandom(descriptors)} ${getRandom(places)}`,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis est modi, facere sit eius amet provident ab reprehenderit quos nemo optio culpa cum aspernatur suscipit eveniet. Eveniet quod quas similique.",
            price: Math.floor(Math.random() * 20) + 10,
            images: [
                {
                    url: 'https://res.cloudinary.com/dmaa2vq0i/image/upload/v1692201648/yelpcamp/so4veut9bkekiiuim46r.jpg',
                    filename: 'yelpcamp/so4veut9bkekiiuim46r'
                  },
                  {
                    url: 'https://res.cloudinary.com/dmaa2vq0i/image/upload/v1692201673/yelpcamp/kccaz5usfc3j5bh5sgil.jpg',
                    filename: 'yelpcamp/kccaz5usfc3j5bh5sgil'
                  }
            ]
        });
        await camp.save(); 
    }
    console.log("camps added")
}

seedDB()
    .then(() => mongoose.connection.close());