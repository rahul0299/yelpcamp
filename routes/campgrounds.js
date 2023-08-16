const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const ExpressError = require('../utils/ExpressError');
const { campgroundJoiSchema } = require('../schemas');
const { isLoggedIn } = require('../middleware'); 

const validateCampground = (req, res, next) => {
    const { error } = campgroundJoiSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

router.get('/:id', catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate('reviews').populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find campground');
        return res.redirect(`/campgrounds`);
    }
    res.render("campgrounds/show", { campground });
}));

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Cannot find campground');
        return res.redirect(`/campgrounds`);
    }
    res.render("campgrounds/edit", { campground });
}));

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user.id;
    await campground.save();
    req.flash("success", "Successfully created campground");
    res.redirect(`/campgrounds/${campground.id}`);
}));

router.patch('/:id', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const camp = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground });
    req.flash("success", "Successfully updated campground");
    res.redirect(`/campgrounds/${camp.id}`);
}));

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground");
    res.redirect('/campgrounds');
}));

module.exports = router;