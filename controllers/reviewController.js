const Review = require('./../models/reviewModel');
const Booking = require('./../models/bookingModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

exports.setTourUserIds = (req, res, next) => {
  //Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

// Middleware: Verify the user has booked the tour before allowing a review
exports.checkIfBooked = catchAsync(async (req, res, next) => {
  const tourId = req.params.tourId || req.body.tour;

  if (!tourId) {
    return next(new AppError('A review must belong to a tour.', 400));
  }

  // 1) Check if a booking exists for this user + tour
  const booking = await Booking.findOne({
    tour: tourId,
    user: req.user.id,
  });

  if (!booking) {
    return next(
      new AppError('You can only review a tour that you have booked.', 403),
    );
  }

  // 2) Prevent duplicate reviews
  const existingReview = await Review.findOne({
    tour: tourId,
    user: req.user.id,
  });

  if (existingReview) {
    return next(
      new AppError(
        'You have already reviewed this tour. You can update your existing review instead.',
        400,
      ),
    );
  }

  next();
});

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReviews = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
