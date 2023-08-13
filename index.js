const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const { campgroundJoiSchema, reviewJoiSchema } = require('./schemas');
const Review = require('./models/review');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => console.log("Connected to DB"))
    .catch(err => console.log("Error connecting to DB", err));

app.engine('ejs', ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get('/', (req, res) => {
    res.render("home");
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const { message = "Something went wrong", statusCode = 500} = err;
    console.log(err.message);
    console.log(err);
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log("Listening on port 3000");
});