const express = require('express');
const viewsController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

//authController.isLoggedIn,
router.get('/', authController.isLoggedIn, viewsController.getOverview); // Todo: Review whether 'authController.isLoggedIn' is necessary for now
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour); // Todo: Review whether 'authController.isLoggedIn' is necessary for now
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm); // Todo: Review whether 'authController.isLoggedIn' is necessary for now
router.get('/me', authController.protect, viewsController.getAccount);

router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;
