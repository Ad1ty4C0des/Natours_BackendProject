const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const Review = require('../models/reviewModel');
const Favourite = require('../models/favouriteModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking')
    res.locals.alert =
      "Your booking was successful! Please check your email for a confirmation. If your bookings doesn't show up here immediately, please come back later.";

  next();
};

exports.getOverview = catchAsync(async (req, res, next) => {
  //1.) Get tour data from collections
  const tours = await Tour.find();

  // 2.) If logged in, get user's favourited tour IDs
  let favouriteIds = [];
  if (res.locals.user) {
    const favs = await Favourite.find({ user: res.locals.user._id }).select(
      'tour',
    );
    favouriteIds = favs.map((f) => f.tour._id?.toString() || f.tour.toString());
  }

  //3.)Render that template using tour data from 1)
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
    favouriteIds,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  //1.) Get the data, for requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name', 404));
  }

  // 2.) Check if the logged-in user has booked this tour
  let hasBooked = false;
  let hasReviewed = false;
  let isFavourited = false;

  if (res.locals.user) {
    const booking = await Booking.findOne({
      tour: tour._id,
      user: res.locals.user._id,
    });
    hasBooked = !!booking;

    if (hasBooked) {
      const existingReview = await Review.findOne({
        tour: tour._id,
        user: res.locals.user._id,
      });
      hasReviewed = !!existingReview;
    }

    const fav = await Favourite.findOne({
      tour: tour._id,
      user: res.locals.user._id,
    });
    isFavourited = !!fav;
  }

  //3.)Render the template using the data from 1)
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
    mapboxToken: process.env.MAPBOX_TOKEN,
    hasBooked,
    hasReviewed,
    isFavourited,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: `Log into your account`,
  });
};

exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Create your account',
  });
};

exports.getForgotPasswordForm = (req, res) => {
  res.status(200).render('forgotPassword', {
    title: 'Forgot Password',
  });
};

exports.getResetPasswordForm = (req, res) => {
  res.status(200).render('resetPassword', {
    title: 'Reset Password',
    token: req.params.token,
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: `Your Account`,
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  //1. Find all Bookings
  const bookings = await Booking.find({ user: req.user.id });

  //2. Find tours with the returned Ids
  const tourIds = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIds } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});

exports.getMyReviews = catchAsync(async (req, res, next) => {
  // Find all reviews by the current user, populate the tour data
  const reviews = await Review.find({ user: req.user.id }).populate({
    path: 'tour',
    select: 'name slug imageCover',
  });

  res.status(200).render('myReviews', {
    title: 'My Reviews',
    reviews,
  });
});

exports.getMyFavourites = catchAsync(async (req, res, next) => {
  const favourites = await Favourite.find({ user: req.user.id });

  const tours = favourites.filter((f) => f.tour).map((f) => f.tour);

  res.status(200).render('overview', {
    title: 'My Favourite Tours',
    tours,
  });
});

exports.getBilling = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id }).sort('-createdAt');

  const totalSpent = bookings.reduce((sum, b) => sum + b.price, 0);

  res.status(200).render('billing', {
    title: 'Billing',
    bookings,
    totalSpent,
  });
});

// ==========================================
// ADMIN MANAGE PAGES
// ==========================================

exports.getManageTours = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render('manageTours', {
    title: 'Manage Tours',
    tours,
  });
});

exports.getManageUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).render('manageUsers', {
    title: 'Manage Users',
    users,
  });
});

exports.getManageReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find().populate({
    path: 'tour',
    select: 'name',
  });
  res.status(200).render('manageReviews', {
    title: 'Manage Reviews',
    reviews,
  });
});

exports.getManageBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find();
  res.status(200).render('manageBookings', {
    title: 'Manage Bookings',
    bookings,
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).render('account', {
    title: `Your Account`,
    user: updatedUser,
  });
});
