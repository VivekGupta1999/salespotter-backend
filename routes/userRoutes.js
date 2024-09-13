const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

//Public Routes
router.post('/register',userController.registerUser);
router.post('/login',userController.loginUser);
router.post('/forgot-password',userController.forgotPassword);
router.post('/reset-password/:token',userController.resetPassword);


//ProtectedRoutes
router.get('/profile',authMiddleware.verifyToken,userController.getUserProfile);
router.put('/profile',authMiddleware.verifyToken,userController.updateUserProfile);
router.post('/delete-user',authMiddleware.verifyToken,userController.deleteUser);
router.put('/change-password',authMiddleware.verifyToken,userController.changePassword);
router.put('/updateNotificationPreferences',authMiddleware.verifyToken,userController.updateNotificatonPreferences);
module.exports = router;
