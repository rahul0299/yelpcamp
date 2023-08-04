const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => console.log("Connected to DB"))
    .catch(err => console.log("Error connecting to DB", err));

app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');

app.get('/makeCampground', (req, res) => {
    const camp = new Campground({ title: 'My Backyard'});
    console.log(camp);
    res.send(camp);
})

app.get('/', (req, res) => {
    res.render("home");
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});