const express = require('express');
const favouriteController = require('../controllers/favouriteController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protected);

router.get('/my-favourites', favouriteController.getMyFavourites);
router.post('/toggle/:tourId', favouriteController.toggleFavourite);
router.get('/check/:tourId', favouriteController.isFavourited);

router.use(authController.restrictTo('admin'));
router.route('/').get(favouriteController.getAllFavourites);
router.route('/:id').delete(favouriteController.deleteFavourite);

module.exports = router;
