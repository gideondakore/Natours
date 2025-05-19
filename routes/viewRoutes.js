const express = require('express');
const viewsController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

//authController.isLoggedIn,
router.get('/', authController.isLoggedIn, viewsController.getOverview); // Todo: Review whether 'authController.isLoggedIn' is necessary for now

router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour); // Todo: Review whether 'authController.isLoggedIn' is necessary for now
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm); // Todo: Review whether 'authController.isLoggedIn' is necessary for now
router.get('/me', authController.protect, viewsController.getAccount);
router.get(
  '/my-tours',
  // bookingController.createBookingCheckuout,
  authController.protect,
  viewsController.getMytours
);

// Used it for when updating user email and name using HTML form
// router.post(
//   '/submit-user-data',
//   authController.protect,
//   viewsController.updateUserData
// );

module.exports = router;
