const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.use(viewsController.alerts);

router.get(
  '/',
  // bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewsController.getOverview,
);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/signup', authController.isLoggedIn, viewsController.getSignupForm);
router.get('/forgot-password', viewsController.getForgotPasswordForm);
router.get('/reset-password/:token', viewsController.getResetPasswordForm);
router.get('/me', authController.protected, viewsController.getAccount);
router.get(
  '/my-tours',
  authController.protected,
  bookingController.createBookingFromRedirect,
  viewsController.getMyTours,
);
router.get(
  '/my-reviews',
  authController.protected,
  viewsController.getMyReviews,
);
router.get(
  '/my-favourites',
  authController.protected,
  viewsController.getMyFavourites,
);
router.get('/billing', authController.protected, viewsController.getBilling);

// Admin routes
router.get(
  '/manage-tours',
  authController.protected,
  authController.restrictTo('admin'),
  viewsController.getManageTours,
);
router.get(
  '/manage-users',
  authController.protected,
  authController.restrictTo('admin'),
  viewsController.getManageUsers,
);
router.get(
  '/manage-reviews',
  authController.protected,
  authController.restrictTo('admin'),
  viewsController.getManageReviews,
);
router.get(
  '/manage-bookings',
  authController.protected,
  authController.restrictTo('admin'),
  viewsController.getManageBookings,
);

router.post(
  '/submit-user-data',
  authController.protected,
  viewsController.updateUserData,
);

module.exports = router;
