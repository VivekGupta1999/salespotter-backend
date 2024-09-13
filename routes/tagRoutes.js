const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');
const authMiddleware = require('../middlewares/authMiddleware');

//public Routes
router.get('/get-Tags',tagController.getTags);


//Protected Routes
router.post('/create-Tag',authMiddleware.verifyToken,authMiddleware.checkAdmin,tagController.createTag);
router.put('/update-Tag/:id',authMiddleware.verifyToken,authMiddleware.checkAdmin,tagController.updateTag);
router.delete('/delete-Tag/:id',authMiddleware.verifyToken,authMiddleware.checkAdmin,tagController.deleteTag);

module.exports = router;