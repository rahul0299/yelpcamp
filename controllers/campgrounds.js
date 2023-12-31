const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');
const mapboxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const token = process.env.MAPBOX_TOKEN;
const geocoder = mapboxGeocoding({ accessToken: token })

module.exports.index = async (req, res) => {    
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.author = req.user.id;
    campground.images = req.files.map(file => {
        return {
            url: file.path,
            filename: file.filename
        }
    });
    await campground.save();
    req.flash("success", "Successfully created campground");
    res.redirect(`/campgrounds/${campground.id}`);
};

module.exports.showCampground = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        })
        .populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find campground');
        return res.redirect(`/campgrounds`);
    }
    res.render("campgrounds/show", { campground });
};

module.exports.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Cannot find campground');
        return res.redirect(`/campgrounds`);
    }
    res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const images = req.files.map(file => {
        return {
            url: file.path,
            filename: file.filename
        }
    });
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    camp.images.push(...images);
    await camp.save();

    if (req.body.deleteImages) {
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }

        await camp.updateOne({
            $pull: {
                images: {
                    filename: {
                        $in: req.body.deleteImages
                    }
                }
            }
        });
    }

    req.flash("success", "Successfully updated campground");
    res.redirect(`/campgrounds/${camp.id}`);
};

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground");
    res.redirect('/campgrounds');
};