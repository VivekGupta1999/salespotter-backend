const express = require('express');
const router = express.Router();
const adController = require('../controllers/adController');
const middleware = require('../middlewares/authMiddleware');

//Protected-routes
router.post('/create-Ad',middleware.verifyToken,adController.createAd);
router.get('/user-Ads',middleware.verifyToken,adController.getUserAds);
router.put('/update-Ad/:id',middleware.verifyToken,adController.updateAd);
router.delete('/delete-Ad/:id',middleware.verifyToken,adController.deleteAd);


//Public Routws
router.get("/get-All-Ads",adController.getAllAds);
router.get("/get-Ad/:id",adController.getAd);



module.exports = router;