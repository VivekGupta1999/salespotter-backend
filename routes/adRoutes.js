const express = require('express');
const router = express.Router();
const adController = require('../controllers/adController');
const middleware = require('../middlewares/authMiddleware');

//routes
router.post('/create-Ad',middleware.verifyToken,adController.createAd);






module.exports = router;