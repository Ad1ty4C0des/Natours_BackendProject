const Favourite = require('../models/favouriteModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

// Toggle favourite: if exists → remove, if not → create
exports.toggleFavourite = catchAsync(async (req, res, next) => {
  const existing = await Favourite.findOne({
    tour: req.params.tourId,
    user: req.user.id,
  });

  if (existing) {
    await Favourite.findByIdAndDelete(existing._id);
    return res.status(200).json({
      status: 'success',
      data: { favourited: false },
    });
  }

  await Favourite.create({ tour: req.params.tourId, user: req.user.id });

  res.status(201).json({
    status: 'success',
    data: { favourited: true },
  });
});

// Check if current user has favourited a tour
exports.isFavourited = catchAsync(async (req, res, next) => {
  const fav = await Favourite.findOne({
    tour: req.params.tourId,
    user: req.user.id,
  });

  res.status(200).json({
    status: 'success',
    data: { favourited: !!fav },
  });
});

exports.getMyFavourites = catchAsync(async (req, res, next) => {
  const favourites = await Favourite.find({ user: req.user.id });

  const tours = favourites
    .filter((f) => f.tour) // guard against deleted tours
    .map((f) => f.tour);

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
});

exports.getAllFavourites = factory.getAll(Favourite);
exports.deleteFavourite = factory.deleteOne(Favourite);
