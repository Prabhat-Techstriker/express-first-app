const express = require('express');
const router = express.Router();
const imageController = require('../controllers/ImageController');
const authMiddleware = require('../middleware/auth-middleware');
const validateRequest = require('../middleware/validationRequest');
const { imageValidation } = require('../validations/userValidation');
const uploadMiddleware = require('../middleware/image-middleware')

router.post('/upload', authMiddleware, uploadMiddleware.single('image'), imageController.uploadImage);
router.get('/get-all-images', authMiddleware, imageController.fetchImages);
router.delete('/delete-images/:id', authMiddleware, imageController.deleteImagesByUser);

module.exports = router;