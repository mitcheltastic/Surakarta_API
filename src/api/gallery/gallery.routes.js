const router = require('express').Router();
const galleryController = require('./gallery.controller');
const authenticateToken = require('../../middlewares/auth.middleware');

router.get('/', galleryController.getAllGalleryItems);
router.post('/', authenticateToken, galleryController.createGalleryItem);
router.delete('/:id', authenticateToken, galleryController.deleteGalleryItem);

module.exports = router;