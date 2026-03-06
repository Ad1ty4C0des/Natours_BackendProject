const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(authController.protected, reviewController.getAllReviews)
  .post(
    authController.protected,
    authController.restrictTo('user'),
    reviewController.createReviews,
  );

module.exports = router;
